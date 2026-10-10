import{Fi as e,Gi as t,I as n,Mi as r,Oi as i,Ti as a,Ui as o,Wi as s,Wt as c,a as l,ai as u,di as d,et as f,fi as p,hi as m,o as h,or as g,ri as _,t as v,wi as y}from"./ScrollViewer-PoO_ma9Z.js";import{n as b}from"./ContentPresenter-NCdCdNyK.js";import{t as x}from"./Button-DjU0urmJ.js";import{t as S}from"./StackPanel-CT7pl8zy.js";import{t as C}from"./ListView-D3xyFzBM.js";import{t as w}from"./SwipeControl-B_-jPv3w.js";import{t as T}from"./ToggleButton-DwmhXZge.js";import{t as ee}from"./ControlExample-C1ahTZEr.js";import{t as te}from"./pageState-BN3kXI7L.js";var ne=`--- header
Swipe right to reveal actions
--- xaml
<Border>
    <Border.Resources>
        <FontIconSource x:Key="AcceptIcon" Glyph="&#xE8FB;"/>
        <FontIconSource x:Key="FlagIcon" Glyph="&#xE7C1;"/>

        <SwipeItems x:Key="left" Mode="Reveal">
            <SwipeItem Text="Accept" IconSource="{StaticResource AcceptIcon}" Invoked="Accept_ItemInvoked"/>
            <SwipeItem Text="Flag" IconSource="{StaticResource FlagIcon}" Invoked="Flag_ItemInvoked"/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1"
        LeftItems="{StaticResource left}" BorderBrush="{ThemeResource ButtonBackground}"
        Width="300" Margin="12" Height="68">
            <TextBlock Text="Swipe Right" Margin="12"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
`,re=`--- header
Swipe left to invoke an execute
--- xaml
<Border>
    <Border.Resources>
        <FontIconSource x:Key="ArchiveIcon" Glyph="&#xE7B8;"/>
        <SwipeItems x:Key="right" Mode="Execute">
            <SwipeItem Text="Archive" IconSource="{StaticResource ArchiveIcon}"
                       BehaviorOnInvoked="Close" Invoked="DeleteOne_ItemInvoked"/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1" BorderBrush="{ThemeResource ButtonBackground}"
        RightItems="{StaticResource right}"
        Width="300" Margin="12" Height="68">
        <TextBlock Text="Swipe Left" Margin="12"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
`,ie=`--- header
Custom Swipe in a ListView
--- xaml
<ListView x:Name="lv" Width="400" Height="300" Margin="12">
    <ListView.Resources>
        <FontIconSource x:Key="ReplyAllIcon" Glyph="&#xE8C2;"/>
        <FontIconSource x:Key="ReadIcon" Glyph="&#xE8C3;"/>
        <FontIconSource x:Key="DeleteIcon" Glyph="&#xE74D;"/>

        <SwipeItems x:Key="left" Mode="Reveal">
            <SwipeItem Text="Reply All" IconSource="{StaticResource ReplyAllIcon}"
                       Background="#FF3e6fa7" Foreground="White"/>
            <SwipeItem Text="Open" IconSource="{StaticResource ReadIcon}"
                       Background="#FFff9501" Foreground="White"/>
        </SwipeItems>
        <SwipeItems x:Key="right" Mode="Execute">
            <SwipeItem Text="Delete" IconSource="{StaticResource DeleteIcon}"
                       Background="#FFF4B183" Invoked="DeleteItem_ItemInvoked"/>
        </SwipeItems>
    </ListView.Resources>

    <ListView.ItemTemplate>
        <DataTemplate>
            <SwipeControl BorderThickness="0,1,0,0" BorderBrush="{ThemeResource ButtonBackground}" Height="68"
                       Width="800" MinWidth="200" LeftItems="{StaticResource left}"
                          RightItems="{StaticResource right}">
                <TextBlock Text="{Binding}" FontSize="24" Margin="12"
                           HorizontalAlignment="Stretch" VerticalAlignment="Center"/>
            </SwipeControl>
        </DataTemplate>
    </ListView.ItemTemplate>
</ListView>
`,ae=`--- header
Gradient Background
--- xaml
<Border>
    <Border.Resources>
        <FontIconSource x:Key="LockIcon" Glyph="&#xE72E;"/>
        <LinearGradientBrush x:Key="PurpleGradient" StartPoint="0,0.5" EndPoint="1,0.5">
            <GradientStop Color="#ff8990f9" Offset="0.0"/>
            <GradientStop Color="#ff5b66fb" Offset="0.5"/>
            <GradientStop Color="#ff5c1df4" Offset="1.0"/>
        </LinearGradientBrush>
        <SwipeItems x:Key="right" Mode="Execute">
            <SwipeItem Text="Lock" Background="{StaticResource PurpleGradient}"
                       BehaviorOnInvoked="Close" IconSource="{StaticResource LockIcon}"/>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1" BorderBrush="{ThemeResource ButtonBackground}"
        RightItems="{StaticResource right}"
        Width="500" Margin="12" Height="68">
        <TextBlock Text="Swipe Left" Margin="12"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
`,oe=`--- header
Custom icons
--- xaml
<Border>
    <Border.Resources>
        <SwipeItems x:Key="left" Mode="Reveal">
            <SwipeItem Text="Coffee">
                <SwipeItem.IconSource>
                    <BitmapIconSource UriSource="ms-appx:///Assets/SampleMedia/CoffeeCup.png"/>
                </SwipeItem.IconSource>
            </SwipeItem>
        </SwipeItems>
    </Border.Resources>
    <SwipeControl BorderThickness="1"
        LeftItems="{StaticResource left}" BorderBrush="{ThemeResource ButtonBackground}"
        Width="300" Margin="12" Height="68">
            <TextBlock Text="Swipe Right" Margin="12"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </SwipeControl>
</Border>
`,E=p({__name:`SwipeControlPage`,setup(e,{expose:i}){i();let{t:c}=f(),u=m(`currentPage`),{isFavoriteState:d,pageTheme:p,toggleTheme:y,toggleFavorite:E}=te(u?.value||`swipecontrol`);a(g,s({}));let D=_(()=>({PageTitle:c(`text.swipecontrol`),Description:c(`text.swipecontrol-subtitle`),ToggleTheme:c(`gallery.page-header.toggle-theme`),RevealHeader:c(`sample.swipecontrol.reveal-actions`),ExecuteHeader:c(`sample.swipecontrol.execute`),ListHeader:c(`sample.swipecontrol.custom-list`),GradientHeader:c(`sample.swipecontrol.gradient`),IconsHeader:c(`sample.swipecontrol.custom-icons`),SwipeRight:c(`sample.swipecontrol.swipe-right`),SwipeLeft:c(`sample.swipecontrol.swipe-left`),Archive:c(`sample.swipecontrol.archive`),ReplyAll:c(`sample.swipecontrol.reply-all`),Open:c(`sample.swipecontrol.open`),Delete:c(`sample.swipecontrol.delete`),Lock:c(`sample.swipecontrol.lock`),Coffee:c(`sample.swipecontrol.coffee`)})),O=_(()=>c(d.value?`gallery.remove-favorite`:`gallery.add-favorite`)),k=_(()=>d.value?``:``),A=o(!1),j=o(!1),M=o(!1),N=o(!1),P=o(!1),F=o([1,2,3,4]),I=_(()=>F.value.map(e=>c(`sample.swipecontrol.list-item`,{index:e}))),L=_(()=>c(j.value?`sample.swipecontrol.cancel`:`sample.swipecontrol.accept`)),R=_(()=>c(M.value?`sample.swipecontrol.unmark`:`sample.swipecontrol.flag`)),z=_(()=>j.value?``:N.value?``:``),B=_(()=>M.value?``:P.value?``:``),V=_(()=>c(j.value?M.value?`sample.swipecontrol.accepted-flagged`:`sample.swipecontrol.accepted`:M.value?`sample.swipecontrol.flagged`:`sample.swipecontrol.swipe-right`)),H=_(()=>c(A.value?`sample.swipecontrol.archived`:`sample.swipecontrol.swipe-left`)),U=t(),W=t(),G=t(),K=t();r(V,e=>{U.value&&(U.value.Content.Text=e)}),r(H,e=>{W.value&&(W.value.Content.Text=e)}),r(L,e=>{G.value&&(G.value.Text=e)}),r(R,e=>{K.value&&(K.value.Text=e)});function se(e,t){U.value=t.SwipeControl,G.value=e,j.value=!j.value,N.value=!0,t.SwipeControl.Content.Text=V.value,e.IconSource={Glyph:z.value},e.Text=L.value}function ce(e,t){U.value=t.SwipeControl,K.value=e,M.value=!M.value,P.value=!0,t.SwipeControl.Content.Text=V.value,e.IconSource={Glyph:B.value},e.Text=R.value}function le(e,t){W.value=t.SwipeControl,A.value=!A.value,t.SwipeControl.Content.Text=H.value}let q=o(null);function J(e,t){let n=I.value.indexOf(t.SwipeControl.DataContext);n<0||(q.value={action:e,index:F.value[n]},e===`delete`&&F.value.splice(n,1))}function ue(e,t){J(`delete`,t)}function Y(e,t){J(`reply-all`,t)}function de(e,t){J(`open`,t)}let fe=_(()=>q.value?c(`sample.swipecontrol.item-action-output`,{action:c(`sample.swipecontrol.${q.value.action}`),item:c(`sample.swipecontrol.list-item`,{index:q.value.index}),count:I.value.length}):c(`sample.swipecontrol.remaining-items`,{count:I.value.length})),X=o(!1),Z=o(!1);function pe(){X.value=!0}function me(){Z.value=!0}let he=_(()=>X.value?c(`sample.swipecontrol.lock-invoked`):``),ge=_(()=>Z.value?c(`sample.swipecontrol.coffee-invoked`):``),Q=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0]?.trim()??``,$={t:c,currentPage:u,isFavoriteState:d,pageTheme:p,toggleTheme:y,toggleFavorite:E,Labels:D,FavoriteLabel:O,FavoriteGlyph:k,isArchived:A,isAccepted:j,isFlagged:M,hasAccepted:N,hasFlagged:P,itemNumbers:F,items:I,AcceptText:L,FlagText:R,AcceptGlyph:z,FlagGlyph:B,RevealText:V,ArchiveText:H,revealControl:U,archiveControl:W,invokedAcceptItem:G,invokedFlagItem:K,Accept_ItemInvoked:se,Flag_ItemInvoked:ce,DeleteOne_ItemInvoked:le,lastListAction:q,listItemInvoked:J,DeleteItem_ItemInvoked:ue,ReplyAll_ItemInvoked:Y,Open_ItemInvoked:de,ListOutput:fe,lockInvoked:X,coffeeInvoked:Z,Lock_ItemInvoked:pe,Coffee_ItemInvoked:me,LockOutput:he,CoffeeOutput:ge,codePart:Q,RevealXaml:Q(ne),ExecuteXaml:Q(re),ListXaml:Q(ie),GradientXaml:Q(ae),IconsXaml:Q(oe),Border:b,Button:x,ControlExample:ee,FontIcon:l,ListView:C,Page:n,ScrollViewer:v,StackPanel:S,SwipeControl:w,TextBlock:h,ToggleButton:T};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function D(t,n,r,a,o,s){let c=i(`Setter`),l=i(`Style`),f=i(`FontIconSource`),p=i(`SwipeItem`),m=i(`SwipeItems`),h=i(`DataTemplate`),g=i(`GradientStop`),_=i(`LinearGradientBrush`),v=i(`BitmapIconSource`),b=i(`SwipeItem.IconSource`);return y(),u(a.Page,null,{default:e(()=>[d(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[d(a.StackPanel,{class:`gallery-item-page`},{default:e(()=>[d(a.StackPanel,{class:`page-heading`},{default:e(()=>[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`,HorizontalAlignment:`Right`},{default:e(()=>[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[d(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[d(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),d(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[d(a.StackPanel.Resources,null,{default:e(()=>[d(l,{TargetType:`ListViewItem`},{default:e(()=>[d(c,{Property:`Padding`,Value:`0`})]),_:1})]),_:1}),d(a.StackPanel,null,{default:e(()=>[d(a.ControlExample,{"x:Name":`Example1`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeRightRevealActions.txt`,HeaderText:`{x:Bind Labels.RevealHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RevealXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:e(()=>[d(a.ControlExample.Example,null,{default:e(()=>[d(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:e(()=>[d(a.Border,null,{default:e(()=>[d(a.Border.Resources,null,{default:e(()=>[d(f,{"x:Key":`AcceptIcon`,Glyph:`{x:Bind AcceptGlyph, Mode=OneWay}`}),d(f,{"x:Key":`FlagIcon`,Glyph:`{x:Bind FlagGlyph, Mode=OneWay}`}),d(m,{"x:Key":`left`,Mode:`Reveal`},{default:e(()=>[d(p,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource AcceptIcon}`,Invoked:`Accept_ItemInvoked`,Text:`{x:Bind AcceptText, Mode=OneWay}`}),d(p,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource FlagIcon}`,Invoked:`Flag_ItemInvoked`,Text:`{x:Bind FlagText, Mode=OneWay}`})]),_:1})]),_:1}),d(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:e(()=>[d(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:e(()=>[d(a.TextBlock,{Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options)]),_:1}),d(a.ControlExample,{"x:Name":`Example2`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeLeftInvokeExecute.txt`,HeaderText:`{x:Bind Labels.ExecuteHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ExecuteXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:e(()=>[d(a.ControlExample.Example,null,{default:e(()=>[d(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:e(()=>[d(a.Border,null,{default:e(()=>[d(a.Border.Resources,null,{default:e(()=>[d(f,{"x:Key":`ArchiveIcon`,Glyph:``}),d(m,{"x:Key":`right`,Mode:`Execute`},{default:e(()=>[d(p,{BehaviorOnInvoked:`Close`,IconSource:`{StaticResource ArchiveIcon}`,Invoked:`DeleteOne_ItemInvoked`,Text:`{x:Bind Labels.Archive, Mode=OneWay}`})]),_:1})]),_:1}),d(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:e(()=>[d(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:e(()=>[d(a.TextBlock,{Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options)]),_:1}),d(a.ControlExample,{"x:Name":`Example3`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomSwipeListview.txt`,HeaderText:`{x:Bind Labels.ListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ListXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:e(()=>[d(a.ControlExample.Example,null,{default:e(()=>[d(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:e(()=>[d(a.ListView,{"x:Name":`lv`,class:`swipe-list`,Width:`800`,Height:`300`,MinWidth:`200`,Margin:`12`,ItemsSource:`{x:Bind items, Mode=OneWay}`},{default:e(()=>[d(a.ListView.Resources,null,{default:e(()=>[d(f,{"x:Key":`ReplyAllIcon`,Glyph:``}),d(f,{"x:Key":`ReadIcon`,Glyph:``}),d(f,{"x:Key":`DeleteIcon`,Glyph:``}),d(m,{"x:Key":`left`,Mode:`Reveal`},{default:e(()=>[d(p,{Background:`#FF3e6fa7`,Foreground:`White`,IconSource:`{StaticResource ReplyAllIcon}`,Invoked:`ReplyAll_ItemInvoked`,Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`}),d(p,{Background:`#FFff9501`,Foreground:`White`,IconSource:`{StaticResource ReadIcon}`,Invoked:`Open_ItemInvoked`,Text:`{x:Bind Labels.Open, Mode=OneWay}`})]),_:1}),d(m,{"x:Key":`right`,Mode:`Execute`},{default:e(()=>[d(p,{Background:`Red`,IconSource:`{StaticResource DeleteIcon}`,Invoked:`DeleteItem_ItemInvoked`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1})]),_:1}),d(a.ListView.ItemTemplate,null,{default:e(()=>[d(h,null,{default:e(()=>[d(a.SwipeControl,{Height:`68`,MinWidth:`200`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`0,1,0,0`,LeftItems:`{StaticResource left}`,RightItems:`{StaticResource right}`},{default:e(()=>[d(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,FontSize:`24`,Text:`{Binding}`,TextTrimming:`CharacterEllipsis`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:e(()=>[d(a.TextBlock,{Text:`{x:Bind ListOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options)]),_:1}),d(a.ControlExample,{"x:Name":`Example4`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlGradientBackground.txt`,HeaderText:`{x:Bind Labels.GradientHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind GradientXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:e(()=>[d(a.ControlExample.Example,null,{default:e(()=>[d(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:e(()=>[d(a.Border,null,{default:e(()=>[d(a.Border.Resources,null,{default:e(()=>[d(f,{"x:Key":`LockIcon`,Glyph:``}),d(_,{"x:Key":`PurpleGradient`,StartPoint:`0,0.5`,EndPoint:`1,0.5`},{default:e(()=>[d(g,{Offset:`0.0`,Color:`#ff8990f9`}),d(g,{Offset:`0.5`,Color:`#ff5b66fb`}),d(g,{Offset:`1.0`,Color:`#ff5c1df4`})]),_:1}),d(m,{"x:Key":`right`,Mode:`Execute`},{default:e(()=>[d(p,{Background:`{StaticResource PurpleGradient}`,BehaviorOnInvoked:`Close`,IconSource:`{StaticResource LockIcon}`,Invoked:`Lock_ItemInvoked`,Text:`{x:Bind Labels.Lock, Mode=OneWay}`})]),_:1})]),_:1}),d(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:e(()=>[d(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeLeft, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:e(()=>[d(a.TextBlock,{Text:`{x:Bind LockOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options)]),_:1}),d(a.ControlExample,{"x:Name":`Example5`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:e(()=>[d(a.ControlExample.Example,null,{default:e(()=>[d(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:e(()=>[d(a.Border,null,{default:e(()=>[d(a.Border.Resources,null,{default:e(()=>[d(m,{"x:Key":`left`,Mode:`Reveal`},{default:e(()=>[d(p,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,Invoked:`Coffee_ItemInvoked`,Text:`{x:Bind Labels.Coffee, Mode=OneWay}`},{default:e(()=>[d(b,null,{default:e(()=>[d(v,{UriSource:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png`})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:e(()=>[d(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeRight, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:e(()=>[d(a.TextBlock,{Text:`{x:Bind CoffeeOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=c(E,[[`render`,D],[`__scopeId`,`data-v-fef6bec6`],[`__file`,`SwipeControlPage.vue`]]);export{O as default};