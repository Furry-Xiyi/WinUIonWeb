import{Ai as e,Bi as t,Cn as n,Ji as r,Li as i,Mn as a,Ni as o,Xi as s,Yi as c,_i as l,a as u,bi as d,ci as f,dr as p,gi as m,ki as h,o as g,p as _,t as v,ui as y}from"./ScrollViewer-DXAtwYnH.js";import{n as b}from"./ContentPresenter-CE6Vb4DE.js";import{t as x}from"./Button-1Ztf3pH0.js";import{t as S}from"./StackPanel-DGz4UnE4.js";import{t as C}from"./ToggleButton-D0RGNdIP.js";import{t as w}from"./ControlExample-BX-yRpiQ.js";import{t as T}from"./SwipeControl-H6PD1VOr.js";import{t as E}from"./pageState-cPponcIo.js";import{t as D}from"./ListView-I0PBDHkd.js";var O=`--- header
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
`,k=`--- header
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
`,A=`--- header
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
`,j=`--- header
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
`,M=`--- header
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
`,N=a(l({__name:`SwipeControlPage`,setup(a){let{t:l}=_(),{isFavoriteState:N,pageTheme:P,toggleTheme:ee,toggleFavorite:te}=E(d(`currentPage`)?.value||`swipecontrol`);e(p,c({})),f(()=>({PageTitle:l(`text.swipecontrol`),Description:l(`text.swipecontrol-subtitle`),ToggleTheme:l(`gallery.page-header.toggle-theme`),RevealHeader:l(`sample.swipecontrol.reveal-actions`),ExecuteHeader:l(`sample.swipecontrol.execute`),ListHeader:l(`sample.swipecontrol.custom-list`),GradientHeader:l(`sample.swipecontrol.gradient`),IconsHeader:l(`sample.swipecontrol.custom-icons`),SwipeRight:l(`sample.swipecontrol.swipe-right`),SwipeLeft:l(`sample.swipecontrol.swipe-left`),Archive:l(`sample.swipecontrol.archive`),ReplyAll:l(`sample.swipecontrol.reply-all`),Open:l(`sample.swipecontrol.open`),Delete:l(`sample.swipecontrol.delete`),Lock:l(`sample.swipecontrol.lock`),Coffee:l(`sample.swipecontrol.coffee`)})),f(()=>l(N.value?`gallery.remove-favorite`:`gallery.add-favorite`)),f(()=>N.value?``:``);let F=r(!1),I=r(!1),L=r(!1),R=r(!1),z=r(!1),B=r([1,2,3,4]),V=f(()=>B.value.map(e=>l(`sample.swipecontrol.list-item`,{index:e}))),H=f(()=>l(I.value?`sample.swipecontrol.cancel`:`sample.swipecontrol.accept`)),U=f(()=>l(L.value?`sample.swipecontrol.unmark`:`sample.swipecontrol.flag`));f(()=>I.value?``:R.value?``:``),f(()=>L.value?``:z.value?``:``);let W=f(()=>l(I.value?L.value?`sample.swipecontrol.accepted-flagged`:`sample.swipecontrol.accepted`:L.value?`sample.swipecontrol.flagged`:`sample.swipecontrol.swipe-right`)),G=f(()=>l(F.value?`sample.swipecontrol.archived`:`sample.swipecontrol.swipe-left`)),K=s(),q=s(),J=s(),Y=s();i(W,e=>{K.value&&(K.value.Content.Text=e)}),i(G,e=>{q.value&&(q.value.Content.Text=e)}),i(H,e=>{J.value&&(J.value.Text=e)}),i(U,e=>{Y.value&&(Y.value.Text=e)});let X=r(null);f(()=>X.value?l(`sample.swipecontrol.item-action-output`,{action:l(`sample.swipecontrol.${X.value.action}`),item:l(`sample.swipecontrol.list-item`,{index:X.value.index}),count:V.value.length}):l(`sample.swipecontrol.remaining-items`,{count:V.value.length}));let Z=r(!1),Q=r(!1);f(()=>Z.value?l(`sample.swipecontrol.lock-invoked`):``),f(()=>Q.value?l(`sample.swipecontrol.coffee-invoked`):``);let $=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0]?.trim()??``;return $(O),$(k),$(A),$(j),$(M),(e,r)=>{let i=o(`Setter`),a=o(`Style`),s=o(`FontIconSource`),c=o(`SwipeItem`),l=o(`SwipeItems`),d=o(`DataTemplate`),f=o(`GradientStop`),p=o(`LinearGradientBrush`),_=o(`BitmapIconSource`),E=o(`SwipeItem.IconSource`);return h(),y(n,null,{default:t(()=>[m(v,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[m(S,{class:`gallery-item-page`},{default:t(()=>[m(S,{class:`page-heading`},{default:t(()=>[m(g,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(g,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(S,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`,HorizontalAlignment:`Right`},{default:t(()=>[m(x,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[m(u,{Glyph:``,FontSize:`16`})]),_:1}),m(C,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[m(u,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),m(S,{class:`gallery-page-content`},{default:t(()=>[m(S.Resources,null,{default:t(()=>[m(a,{TargetType:`ListViewItem`},{default:t(()=>[m(i,{Property:`Padding`,Value:`0`})]),_:1})]),_:1}),m(S,null,{default:t(()=>[m(w,{"x:Name":`Example1`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeRightRevealActions.txt`,HeaderText:`{x:Bind Labels.RevealHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RevealXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(w.Example,null,{default:t(()=>[m(v,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(b,null,{default:t(()=>[m(b.Resources,null,{default:t(()=>[m(s,{"x:Key":`AcceptIcon`,Glyph:`{x:Bind AcceptGlyph, Mode=OneWay}`}),m(s,{"x:Key":`FlagIcon`,Glyph:`{x:Bind FlagGlyph, Mode=OneWay}`}),m(l,{"x:Key":`left`,Mode:`Reveal`},{default:t(()=>[m(c,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource AcceptIcon}`,Invoked:`Accept_ItemInvoked`,Text:`{x:Bind AcceptText, Mode=OneWay}`}),m(c,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource FlagIcon}`,Invoked:`Flag_ItemInvoked`,Text:`{x:Bind FlagText, Mode=OneWay}`})]),_:1})]),_:1}),m(T,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:t(()=>[m(g,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(w.Output,null,{default:t(()=>[m(g,{Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(w.Options)]),_:1}),m(w,{"x:Name":`Example2`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeLeftInvokeExecute.txt`,HeaderText:`{x:Bind Labels.ExecuteHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ExecuteXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(w.Example,null,{default:t(()=>[m(v,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(b,null,{default:t(()=>[m(b.Resources,null,{default:t(()=>[m(s,{"x:Key":`ArchiveIcon`,Glyph:``}),m(l,{"x:Key":`right`,Mode:`Execute`},{default:t(()=>[m(c,{BehaviorOnInvoked:`Close`,IconSource:`{StaticResource ArchiveIcon}`,Invoked:`DeleteOne_ItemInvoked`,Text:`{x:Bind Labels.Archive, Mode=OneWay}`})]),_:1})]),_:1}),m(T,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:t(()=>[m(g,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(w.Output,null,{default:t(()=>[m(g,{Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(w.Options)]),_:1}),m(w,{"x:Name":`Example3`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomSwipeListview.txt`,HeaderText:`{x:Bind Labels.ListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ListXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(w.Example,null,{default:t(()=>[m(v,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(D,{"x:Name":`lv`,class:`swipe-list`,Width:`800`,Height:`300`,MinWidth:`200`,Margin:`12`,ItemsSource:`{x:Bind items, Mode=OneWay}`},{default:t(()=>[m(D.Resources,null,{default:t(()=>[m(s,{"x:Key":`ReplyAllIcon`,Glyph:``}),m(s,{"x:Key":`ReadIcon`,Glyph:``}),m(s,{"x:Key":`DeleteIcon`,Glyph:``}),m(l,{"x:Key":`left`,Mode:`Reveal`},{default:t(()=>[m(c,{Background:`#FF3e6fa7`,Foreground:`White`,IconSource:`{StaticResource ReplyAllIcon}`,Invoked:`ReplyAll_ItemInvoked`,Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`}),m(c,{Background:`#FFff9501`,Foreground:`White`,IconSource:`{StaticResource ReadIcon}`,Invoked:`Open_ItemInvoked`,Text:`{x:Bind Labels.Open, Mode=OneWay}`})]),_:1}),m(l,{"x:Key":`right`,Mode:`Execute`},{default:t(()=>[m(c,{Background:`Red`,IconSource:`{StaticResource DeleteIcon}`,Invoked:`DeleteItem_ItemInvoked`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1})]),_:1}),m(D.ItemTemplate,null,{default:t(()=>[m(d,null,{default:t(()=>[m(T,{Height:`68`,MinWidth:`200`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`0,1,0,0`,LeftItems:`{StaticResource left}`,RightItems:`{StaticResource right}`},{default:t(()=>[m(g,{Margin:`12`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,FontSize:`24`,Text:`{Binding}`,TextTrimming:`CharacterEllipsis`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(w.Output,null,{default:t(()=>[m(g,{Text:`{x:Bind ListOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(w.Options)]),_:1}),m(w,{"x:Name":`Example4`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlGradientBackground.txt`,HeaderText:`{x:Bind Labels.GradientHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind GradientXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(w.Example,null,{default:t(()=>[m(v,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(b,null,{default:t(()=>[m(b.Resources,null,{default:t(()=>[m(s,{"x:Key":`LockIcon`,Glyph:``}),m(p,{"x:Key":`PurpleGradient`,StartPoint:`0,0.5`,EndPoint:`1,0.5`},{default:t(()=>[m(f,{Offset:`0.0`,Color:`#ff8990f9`}),m(f,{Offset:`0.5`,Color:`#ff5b66fb`}),m(f,{Offset:`1.0`,Color:`#ff5c1df4`})]),_:1}),m(l,{"x:Key":`right`,Mode:`Execute`},{default:t(()=>[m(c,{Background:`{StaticResource PurpleGradient}`,BehaviorOnInvoked:`Close`,IconSource:`{StaticResource LockIcon}`,Invoked:`Lock_ItemInvoked`,Text:`{x:Bind Labels.Lock, Mode=OneWay}`})]),_:1})]),_:1}),m(T,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:t(()=>[m(g,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeLeft, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(w.Output,null,{default:t(()=>[m(g,{Text:`{x:Bind LockOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(w.Options)]),_:1}),m(w,{"x:Name":`Example5`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(w.Example,null,{default:t(()=>[m(v,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(b,null,{default:t(()=>[m(b.Resources,null,{default:t(()=>[m(l,{"x:Key":`left`,Mode:`Reveal`},{default:t(()=>[m(c,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,Invoked:`Coffee_ItemInvoked`,Text:`{x:Bind Labels.Coffee, Mode=OneWay}`},{default:t(()=>[m(E,null,{default:t(()=>[m(_,{UriSource:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png`})]),_:1})]),_:1})]),_:1})]),_:1}),m(T,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:t(()=>[m(g,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeRight, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(w.Output,null,{default:t(()=>[m(g,{Text:`{x:Bind CoffeeOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(w.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-fef6bec6`]]);export{N as default};