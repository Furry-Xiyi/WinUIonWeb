import{D as e,E as t,H as n,K as r,N as i,S as a,X as o,g as s,h as c,m as l,n as u,t as d}from"./WinScrollViewer-DPrZnleG.js";import{t as f}from"./WinTextBlock-CeUskDRc.js";import{a as p}from"./i18n-DA-FIA7C.js";import{D as m,a as h,c as g,i as _,m as v,r as y}from"./index-CMPZyTwE.js";import{t as b}from"./WinControlExample-C0uhK7Jb.js";import{t as x}from"./WinComboBox-D5zM9OdY.js";import{t as S}from"./pageState-Mr-1-Xo1.js";import{t as C}from"./WinToggleSwitch-qMvlK4se.js";import{t as w}from"./WinNumberBox-DZVn_hAR.js";var T={class:`gallery-item-page`},E={class:`page-heading`},D={class:`page-header-actions`},O=u({__name:`InfoBadgePage`,setup(u){let{t:O}=p(),k=t(`currentPage`),{isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N}=S(l(()=>k?.value||`infobadge`).value),P=r(!0),F=r(`LeftExpanded`),I=l(()=>[{Text:O(`sample.infobadge.left-expanded`),Value:`LeftExpanded`},{Text:O(`sample.infobadge.left-compact`),Value:`LeftCompact`},{Text:O(`sample.infobadge.top`),Value:`Top`}]),L=l(()=>F.value===`LeftCompact`?`LeftCompact`:F.value===`Top`?`Top`:`Left`),R=l(()=>F.value!==`LeftCompact`),z=l(()=>+!!P.value),B=l(()=>[{Content:O(`text.home`),Icon:``,Tag:`Home`},{Content:O(`text.account`),Icon:``,Tag:`Account`},{Content:O(`sample.infobadge.inbox`),Icon:``,Tag:`Inbox`,"AutomationProperties.Name":O(`sample.infobadge.inbox-notifications`,{value:5}),InfoBadge:{Value:5,Opacity:z.value}}]),V=r(`Attention`),H=l(()=>[{Text:O(`sample.infobadge.attention`),Value:`Attention`},{Text:O(`sample.infobadge.informational`),Value:`Informational`},{Text:O(`sample.infobadge.success`),Value:`Success`},{Text:O(`sample.infobadge.critical`),Value:`Critical`}]),U=l(()=>`{StaticResource ${V.value}IconInfoBadgeStyle}`),W=l(()=>`{StaticResource ${V.value}ValueInfoBadgeStyle}`),G=l(()=>`{StaticResource ${V.value}DotInfoBadgeStyle}`),K=r(1),q=e=>{e.NewValue<-1&&(K.value=-1)},J=l(()=>`<WinGrid
  Width="100%"
  RowDefinitions="Auto"
  HorizontalAlignment="Stretch">
  <WinNavigationView
    Height="300"
    PaneDisplayMode="${L.value}"
    :IsPaneOpen="${R.value}"
    :MenuItems="[
      { Content: '${O(`text.home`)}', Icon: '\\uE80F', Tag: 'Home' },
      { Content: '${O(`text.account`)}', Icon: '\\uE77B', Tag: 'Account' },
      {
        Content: '${O(`sample.infobadge.inbox`)}',
        Icon: '\\uE715',
        Tag: 'Inbox',
         'AutomationProperties.Name': '${O(`sample.infobadge.inbox-notifications`,{value:5})}',
         InfoBadge: { Value: 5, Opacity: ${z.value} }
       }
     ]"
     HorizontalAlignment="Stretch">
    <WinGrid />
  </WinNavigationView>
</WinGrid>`),Y=l(()=>`<WinStackPanel
  HorizontalAlignment="Center"
  Orientation="Horizontal"
  Spacing="20">
  <WinInfoBadge
    Style="{StaticResource ${V.value}IconInfoBadgeStyle}"
    HorizontalAlignment="Right" />
  <WinInfoBadge
    Style="{StaticResource ${V.value}ValueInfoBadgeStyle}"
    HorizontalAlignment="Right"
    :Value="10" />
  <WinInfoBadge
    Style="{StaticResource ${V.value}DotInfoBadgeStyle}"
    VerticalAlignment="Center" />
</WinStackPanel>`),X=l(()=>`<WinButton
  Padding="0"
  Width="200"
  Height="60"
  HorizontalAlignment="Center"
  HorizontalContentAlignment="Stretch"
  VerticalContentAlignment="Stretch"
  ToolTipService.ToolTip="${O(`sample.infobadge.refresh-required`)}">
  <WinGrid
    Width="Auto"
    Height="Auto"
    HorizontalAlignment="Stretch"
    VerticalAlignment="Stretch">
    <WinTextBlock
      Text="&#xE895;"
      FontFamily="WinUIOnWebIcons"
      HorizontalTextAlignment="Center" />
    <WinInfoBadge
      Background="#C42B1C"
      HorizontalAlignment="Right"
      VerticalAlignment="Top"
      :IconSource="{ Glyph: '\\uF13C', FontFamily: 'WinUIOnWebIcons' }" />
  </WinGrid>
</WinButton>`),Z=l(()=>`<WinInfoBadge
  HorizontalAlignment="Center"
  :Value="dynamicValue" />

<WinNumberBox
  v-model:Value="dynamicValue"
  Header="${O(`sample.infobadge.value`)}"
  :Minimum="-1"
  SpinButtonPlacementMode="Inline"
  @ValueChanged="onDynamicValueChanged" />`);return(t,r)=>(i(),s(d,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[c(`div`,T,[c(`div`,E,[a(f,{class:`page-header`,Text:t.$t(`text.infobadge`)},null,8,[`Text`]),a(f,{class:`page-description`,Text:t.$t(`sample.infobadge.description`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),c(`div`,D,[a(g,e({class:`header-action`},{"tooltipservice.tooltip":t.$t(`sample.navigationview.change-theme`)},{onClick:o(M)}),{default:n(()=>[a(f,{class:`icon`,Text:``})]),_:1},16,[`onClick`]),a(y,e({class:`header-action`,IsChecked:o(A)},{"tooltipservice.tooltip":o(A)?t.$t(`sample.navigationview.remove-favorite`):t.$t(`sample.navigationview.add-favorite`)},{"onUpdate:IsChecked":o(N)}),{default:n(()=>[a(f,{class:`icon`,Text:o(A)?``:``},null,8,[`Text`])]),_:1},16,[`IsChecked`,`onUpdate:IsChecked`])])]),a(_,{class:`gallery-page-content`,Spacing:`0`},{default:n(()=>[a(b,{class:`basic-input-example-theme`,HorizontalContentAlignment:`Stretch`,headerText:t.$t(`sample.infobadge.embedded-navigationview`),theme:o(j),vue:J.value},{example:n(()=>[a(h,{Width:`100%`,RowDefinitions:`Auto`,HorizontalAlignment:`Stretch`},{default:n(()=>[a(v,{Height:`300`,MenuItems:B.value,PaneDisplayMode:L.value,IsPaneOpen:R.value,HorizontalAlignment:`Stretch`},{default:n(()=>[a(h)]),_:1},8,[`MenuItems`,`PaneDisplayMode`,`IsPaneOpen`])]),_:1})]),options:n(()=>[a(_,{Width:`160`},{default:n(()=>[a(C,{IsOn:P.value,"onUpdate:IsOn":r[0]||=e=>P.value=e,Header:t.$t(`sample.infobadge.opacity`)},null,8,[`IsOn`,`Header`]),a(x,{SelectedValue:F.value,"onUpdate:SelectedValue":r[1]||=e=>F.value=e,Header:t.$t(`sample.infobadge.display-mode`),ItemsSource:I.value,DisplayMemberPath:`Text`,SelectedValuePath:`Value`},null,8,[`SelectedValue`,`Header`,`ItemsSource`])]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`]),a(b,{class:`basic-input-example-theme`,HorizontalContentAlignment:`Stretch`,headerText:t.$t(`sample.infobadge.different-styles`),theme:o(j),vue:Y.value},{example:n(()=>[a(_,{HorizontalAlignment:`Center`,Orientation:`Horizontal`,Spacing:`20`},{default:n(()=>[a(m,{HorizontalAlignment:`Right`,Style:U.value},null,8,[`Style`]),a(m,{HorizontalAlignment:`Right`,Style:W.value,Value:10},null,8,[`Style`]),a(m,{VerticalAlignment:`Center`,Style:G.value},null,8,[`Style`])]),_:1})]),options:n(()=>[a(_,{Width:`160`},{default:n(()=>[a(x,{SelectedValue:V.value,"onUpdate:SelectedValue":r[2]||=e=>V.value=e,Header:t.$t(`sample.infobadge.styles`),ItemsSource:H.value,DisplayMemberPath:`Text`,SelectedValuePath:`Value`},null,8,[`SelectedValue`,`Header`,`ItemsSource`])]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`]),a(b,{class:`basic-input-example-theme`,HorizontalContentAlignment:`Stretch`,headerText:t.$t(`sample.infobadge.inside-another-control`),theme:o(j),vue:X.value},{example:n(()=>[a(g,e({Width:`200`,Height:`60`,Padding:`0`,HorizontalAlignment:`Center`,HorizontalContentAlignment:`Stretch`,VerticalContentAlignment:`Stretch`},{"tooltipservice.tooltip":t.$t(`sample.infobadge.refresh-required`)}),{default:n(()=>[a(h,{class:`badge-button-grid`,Width:`Auto`,Height:`Auto`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Stretch`},{default:n(()=>[a(f,{class:`sample-sync-icon icon`,Text:``,FontFamily:`WinUIonWebIcons`,HorizontalTextAlignment:`Center`}),a(m,{Background:`#C42B1C`,HorizontalAlignment:`Right`,VerticalAlignment:`Top`,IconSource:{Glyph:``,FontFamily:`WinUIOnWebIcons`}})]),_:1})]),_:1},16)]),_:1},8,[`headerText`,`theme`,`vue`]),a(b,{class:`basic-input-example-theme`,HorizontalContentAlignment:`Stretch`,headerText:t.$t(`sample.infobadge.dynamic-value`),theme:o(j),vue:Z.value},{example:n(()=>[a(m,{HorizontalAlignment:`Center`,Value:K.value},null,8,[`Value`])]),options:n(()=>[a(_,{Width:`160`},{default:n(()=>[a(w,{Value:K.value,"onUpdate:Value":r[3]||=e=>K.value=e,Header:t.$t(`sample.infobadge.value`),Minimum:-1,SpinButtonPlacementMode:`Inline`,onValueChanged:q},null,8,[`Value`,`Header`])]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`])]),_:1})])]),_:1}))}},[[`__scopeId`,`data-v-10269d62`]]);export{O as default};