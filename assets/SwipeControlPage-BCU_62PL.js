import{C as e,E as t,G as n,H as r,K as i,N as a,S as o,X as s,g as c,h as l,m as u,n as d,t as f}from"./WinScrollViewer-DPrZnleG.js";import{t as p}from"./WinTextBlock-CeUskDRc.js";import{a as m}from"./i18n-DA-FIA7C.js";import{a as h,c as g,r as _}from"./index-CMPZyTwE.js";import{t as v}from"./WinControlExample-C0uhK7Jb.js";import{t as y}from"./pageState-Mr-1-Xo1.js";import{t as b}from"./WinListView-XkZgQFrK.js";import{t as x}from"./WinSwipeControl-Cp3V_LW8.js";var S={class:`gallery-item-page`},C={class:`page-heading`},w={class:`page-header-actions`},T={class:`gallery-page-content`},E=`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png`,D=d(e({__name:`SwipeControlPage`,setup(e){let d=t(`currentPage`),{isFavoriteState:D,pageTheme:O,toggleTheme:k,toggleFavorite:A}=y(u(()=>d?.value||`swipecontrol`).value),{t:j}=m(),M=i(j(`sample.swipecontrol.swipe-right`)),N=i(j(`sample.swipecontrol.swipe-left`)),P=i(Array.from({length:4},(e,t)=>j(`sample.swipecontrol.list-item`,{index:t+1}))),F=i(!1),I=i(!1),L=i(!1),R=()=>{F.value&&I.value?M.value=j(`sample.swipecontrol.accepted-flagged`):F.value?M.value=j(`sample.swipecontrol.accepted`):I.value?M.value=j(`sample.swipecontrol.flagged`):M.value=j(`sample.swipecontrol.swipe-right`)},z=n({Mode:`Reveal`,Items:[n({Text:j(`sample.swipecontrol.accept`),IconSource:``,Background:`var(--ButtonBackgroundThemeBrush, var(--ctrl-fill-default))`,Foreground:`var(--AppBarItemForegroundThemeBrush, var(--text-primary))`,Invoked:e=>{F.value=!F.value,R(),e.IconSource=F.value?``:``,e.Text=j(F.value?`sample.swipecontrol.cancel`:`sample.swipecontrol.accept`)}}),n({Text:j(`sample.swipecontrol.flag`),IconSource:``,Background:`var(--ButtonBackgroundThemeBrush, var(--ctrl-fill-default))`,Foreground:`var(--AppBarItemForegroundThemeBrush, var(--text-primary))`,Invoked:e=>{I.value=!I.value,R(),e.IconSource=I.value?``:``,e.Text=j(I.value?`sample.swipecontrol.unmark`:`sample.swipecontrol.flag`)}})]}),B={Mode:`Execute`,Items:[{Text:j(`sample.swipecontrol.archive`),IconSource:``,BehaviorOnInvoked:`Close`,Invoked:()=>{L.value=!L.value,N.value=j(L.value?`sample.swipecontrol.archived`:`sample.swipecontrol.swipe-left`)}}]},V={Mode:`Reveal`,Items:[{Text:j(`sample.swipecontrol.reply-all`),IconSource:``,Background:`#3e6fa7`,Foreground:`white`},{Text:j(`sample.swipecontrol.open`),IconSource:``,Background:`#ff9501`,Foreground:`white`}]},H=e=>({Mode:`Execute`,Items:[{Text:j(`sample.swipecontrol.delete`),IconSource:``,Background:`Red`,BehaviorOnInvoked:`Close`,Invoked:()=>{P.value=P.value.filter(t=>t!==e)}}]}),U={Mode:`Execute`,Items:[{Text:j(`sample.swipecontrol.lock`),IconSource:``,Background:`linear-gradient(90deg, #8990f9 0%, #5b66fb 50%, #5c1df4 100%)`,BehaviorOnInvoked:`Close`}]},W={Mode:`Reveal`,Items:[{Text:j(`sample.swipecontrol.coffee`),IconSource:{UriSource:E},Background:`var(--ButtonBackgroundThemeBrush, var(--ctrl-fill-default))`,Foreground:`var(--AppBarItemForegroundThemeBrush, var(--text-primary))`}]},G=u(()=>`<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.LeftItems>
    <WinSwipeItems Mode="Reveal">
      <WinSwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="Accept" Text="Accept" Invoked="Accept_ItemInvoked" />
      <WinSwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" IconSource="Flag" Text="Flag" Invoked="Flag_ItemInvoked" />
    </WinSwipeItems>
  </WinSwipeControl.LeftItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Right" />
</WinSwipeControl>`),K=u(()=>`<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.RightItems>
    <WinSwipeItems Mode="Execute">
      <WinSwipeItem BehaviorOnInvoked="Close" IconSource="Archive" Text="Archive" Invoked="DeleteOne_ItemInvoked" />
    </WinSwipeItems>
  </WinSwipeControl.RightItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Left" />
</WinSwipeControl>`),q=u(()=>`<WinListView ItemsSource="listItems" Width="800" Height="300" MinWidth="200" Margin="12">
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinSwipeControl
        Height="68"
        MinWidth="200"
        BorderBrush="{ThemeResource ButtonBackground}"
        BorderThickness="0,1,0,0">
        <WinSwipeControl.LeftItems>
          <WinSwipeItems Mode="Reveal">
            <WinSwipeItem Background="#FF3e6fa7" Foreground="White" IconSource="ReplyAll" Text="Reply All" />
            <WinSwipeItem Background="#FFff9501" Foreground="White" IconSource="Read" Text="Open" />
          </WinSwipeItems>
        </WinSwipeControl.LeftItems>
        <WinSwipeControl.RightItems>
          <WinSwipeItems Mode="Execute">
            <WinSwipeItem Background="Red" IconSource="Delete" Text="Delete" Invoked="DeleteItem_ItemInvoked" />
          </WinSwipeItems>
        </WinSwipeControl.RightItems>
        <WinTextBlock Margin="12" HorizontalAlignment="Stretch" VerticalAlignment="Center" FontSize="24" Text="{Binding}" />
      </WinSwipeControl>
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`),J=u(()=>`<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.RightItems>
    <WinSwipeItems Mode="Execute">
      <WinSwipeItem BehaviorOnInvoked="Close" IconSource="Lock" Text="Lock">
        <WinSwipeItem.Background>
          <WinLinearGradientBrush StartPoint="0,0.5" EndPoint="1,0.5">
            <WinGradientStop Offset="0.0" Color="#ff8990f9" />
            <WinGradientStop Offset="0.5" Color="#ff5b66fb" />
            <WinGradientStop Offset="1.0" Color="#ff5c1df4" />
          </WinLinearGradientBrush>
        </WinSwipeItem.Background>
      </WinSwipeItem>
    </WinSwipeItems>
  </WinSwipeControl.RightItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Left" />
</WinSwipeControl>`),Y=u(()=>`<WinSwipeControl
  BorderThickness="1"
  BorderBrush="{ThemeResource ButtonBackground}"
  Width="500"
  Height="68"
  Margin="12">
  <WinSwipeControl.LeftItems>
    <WinSwipeItems Mode="Reveal">
      <WinSwipeItem Background="{ThemeResource ButtonBackgroundThemeBrush}" Foreground="{ThemeResource AppBarItemForegroundThemeBrush}" Text="Coffee">
        <WinSwipeItem.IconSource>
          <WinBitmapIconSource UriSource="/Assets/SampleMedia/CoffeeCup.png" />
        </WinSwipeItem.IconSource>
      </WinSwipeItem>
    </WinSwipeItems>
  </WinSwipeControl.LeftItems>
  <WinTextBlock Margin="12" HorizontalAlignment="Center" VerticalAlignment="Center" Text="Swipe Right" />
</WinSwipeControl>`);return(e,t)=>(a(),c(f,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[l(`div`,S,[l(`div`,C,[o(p,{class:`page-header`,Text:e.$t(`text.swipecontrol`),role:`heading`,"aria-level":`1`},null,8,[`Text`]),o(p,{class:`page-description`,Text:e.$t(`text.swipecontrol-subtitle`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,w,[o(g,{class:`header-action`,onClick:s(k)},{default:r(()=>[o(p,{class:`icon`,Text:``})]),_:1},8,[`onClick`]),o(_,{class:`header-action`,IsChecked:s(D),"onUpdate:IsChecked":s(A)},{default:r(()=>[o(p,{class:`icon`,Text:s(D)?``:``},null,8,[`Text`])]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),l(`div`,T,[o(v,{class:`basic-input-example-theme`,headerText:e.$t(`sample.swipecontrol.reveal-actions`),theme:s(O),vue:G.value},{example:r(()=>[o(x,{BorderThickness:`1`,BorderBrush:`var(--ButtonBackground, var(--ctrl-fill-default))`,Width:`500`,Height:`68`,Margin:`12`,LeftItems:z},{default:r(()=>[o(h,{class:`swipe-demo-content`},{default:r(()=>[o(p,{Text:M.value},null,8,[`Text`])]),_:1})]),_:1},8,[`LeftItems`])]),_:1},8,[`headerText`,`theme`,`vue`]),o(v,{class:`basic-input-example-theme`,headerText:e.$t(`sample.swipecontrol.execute`),theme:s(O),vue:K.value},{example:r(()=>[o(x,{BorderThickness:`1`,BorderBrush:`var(--ButtonBackground, var(--ctrl-fill-default))`,Width:`500`,Height:`68`,Margin:`12`,RightItems:B},{default:r(()=>[o(h,{class:`swipe-demo-content`},{default:r(()=>[o(p,{Text:N.value},null,8,[`Text`])]),_:1})]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`]),o(v,{class:`basic-input-example-theme`,headerText:e.$t(`sample.swipecontrol.custom-list`),theme:s(O),vue:q.value},{example:r(()=>[o(b,{class:`swipe-list`,ItemsSource:P.value,Width:`800`,Height:`300`,MinWidth:`200`,Margin:`12`},{item:r(({item:e})=>[o(x,{BorderThickness:`0,1,0,0`,BorderBrush:`var(--ButtonBackground, var(--ctrl-fill-default))`,Height:`68`,MinWidth:`200`,LeftItems:V,RightItems:H(e)},{default:r(()=>[o(p,{class:`list-item-content`,Text:e,FontSize:`24`},null,8,[`Text`])]),_:2},1032,[`RightItems`])]),_:1},8,[`ItemsSource`])]),_:1},8,[`headerText`,`theme`,`vue`]),o(v,{class:`basic-input-example-theme`,headerText:e.$t(`sample.swipecontrol.gradient`),theme:s(O),vue:J.value},{example:r(()=>[o(x,{BorderThickness:`1`,BorderBrush:`var(--ButtonBackground, var(--ctrl-fill-default))`,Width:`500`,Height:`68`,Margin:`12`,RightItems:U},{default:r(()=>[o(h,{class:`swipe-demo-content`},{default:r(()=>[o(p,{Text:e.$t(`sample.swipecontrol.swipe-left`)},null,8,[`Text`])]),_:1})]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`]),o(v,{class:`basic-input-example-theme`,headerText:e.$t(`sample.swipecontrol.custom-icons`),theme:s(O),vue:Y.value},{example:r(()=>[o(x,{BorderThickness:`1`,BorderBrush:`var(--ButtonBackground, var(--ctrl-fill-default))`,Width:`500`,Height:`68`,Margin:`12`,LeftItems:W},{default:r(()=>[o(h,{class:`swipe-demo-content`},{default:r(()=>[o(p,{Text:e.$t(`sample.swipecontrol.swipe-right`)},null,8,[`Text`])]),_:1})]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`])])])]),_:1}))}}),[[`__scopeId`,`data-v-11465ffd`]]);export{D as default};