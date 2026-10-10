import{Ai as e,Bi as t,Cn as n,Ji as r,Li as i,Mn as a,Ni as o,Xi as s,Yi as c,_i as l,a as u,bi as d,ci as f,dr as p,gi as m,ki as h,o as g,p as _,t as v,ui as y}from"./ScrollViewer-CHNE18MA.js";import{n as b}from"./ContentPresenter-pBVZeWXF.js";import{t as ee}from"./Button-DO0TiUOq.js";import{t as te}from"./StackPanel-C60XOD66.js";import{t as x}from"./ToggleButton-ZsjZg8Nu.js";import{t as S}from"./ControlExample-BKyw2NwY.js";import{t as C}from"./SwipeControl-DkWiDrFV.js";import{t as w}from"./pageState-Djrh7EdY.js";import{t as T}from"./ListView-CsUAm8Ur.js";var ne=`--- header
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
`,E=l({__name:`SwipeControlPage`,setup(t,{expose:a}){a();let{t:o}=_(),l=d(`currentPage`),{isFavoriteState:m,pageTheme:h,toggleTheme:y,toggleFavorite:E}=w(l?.value||`swipecontrol`);e(p,c({}));let D=f(()=>({PageTitle:o(`text.swipecontrol`),Description:o(`text.swipecontrol-subtitle`),ToggleTheme:o(`gallery.page-header.toggle-theme`),RevealHeader:o(`sample.swipecontrol.reveal-actions`),ExecuteHeader:o(`sample.swipecontrol.execute`),ListHeader:o(`sample.swipecontrol.custom-list`),GradientHeader:o(`sample.swipecontrol.gradient`),IconsHeader:o(`sample.swipecontrol.custom-icons`),SwipeRight:o(`sample.swipecontrol.swipe-right`),SwipeLeft:o(`sample.swipecontrol.swipe-left`),Archive:o(`sample.swipecontrol.archive`),ReplyAll:o(`sample.swipecontrol.reply-all`),Open:o(`sample.swipecontrol.open`),Delete:o(`sample.swipecontrol.delete`),Lock:o(`sample.swipecontrol.lock`),Coffee:o(`sample.swipecontrol.coffee`)})),O=f(()=>o(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),k=f(()=>m.value?``:``),A=r(!1),j=r(!1),M=r(!1),N=r(!1),P=r(!1),F=r([1,2,3,4]),I=f(()=>F.value.map(e=>o(`sample.swipecontrol.list-item`,{index:e}))),L=f(()=>o(j.value?`sample.swipecontrol.cancel`:`sample.swipecontrol.accept`)),R=f(()=>o(M.value?`sample.swipecontrol.unmark`:`sample.swipecontrol.flag`)),z=f(()=>j.value?``:N.value?``:``),B=f(()=>M.value?``:P.value?``:``),V=f(()=>o(j.value?M.value?`sample.swipecontrol.accepted-flagged`:`sample.swipecontrol.accepted`:M.value?`sample.swipecontrol.flagged`:`sample.swipecontrol.swipe-right`)),H=f(()=>o(A.value?`sample.swipecontrol.archived`:`sample.swipecontrol.swipe-left`)),U=s(),W=s(),G=s(),K=s();i(V,e=>{U.value&&(U.value.Content.Text=e)}),i(H,e=>{W.value&&(W.value.Content.Text=e)}),i(L,e=>{G.value&&(G.value.Text=e)}),i(R,e=>{K.value&&(K.value.Text=e)});function se(e,t){U.value=t.SwipeControl,G.value=e,j.value=!j.value,N.value=!0,t.SwipeControl.Content.Text=V.value,e.IconSource={Glyph:z.value},e.Text=L.value}function ce(e,t){U.value=t.SwipeControl,K.value=e,M.value=!M.value,P.value=!0,t.SwipeControl.Content.Text=V.value,e.IconSource={Glyph:B.value},e.Text=R.value}function le(e,t){W.value=t.SwipeControl,A.value=!A.value,t.SwipeControl.Content.Text=H.value}let q=r(null);function J(e,t){let n=I.value.indexOf(t.SwipeControl.DataContext);n<0||(q.value={action:e,index:F.value[n]},e===`delete`&&F.value.splice(n,1))}function ue(e,t){J(`delete`,t)}function Y(e,t){J(`reply-all`,t)}function de(e,t){J(`open`,t)}let fe=f(()=>q.value?o(`sample.swipecontrol.item-action-output`,{action:o(`sample.swipecontrol.${q.value.action}`),item:o(`sample.swipecontrol.list-item`,{index:q.value.index}),count:I.value.length}):o(`sample.swipecontrol.remaining-items`,{count:I.value.length})),X=r(!1),Z=r(!1);function pe(){X.value=!0}function me(){Z.value=!0}let he=f(()=>X.value?o(`sample.swipecontrol.lock-invoked`):``),ge=f(()=>Z.value?o(`sample.swipecontrol.coffee-invoked`):``),Q=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0]?.trim()??``,$={t:o,currentPage:l,isFavoriteState:m,pageTheme:h,toggleTheme:y,toggleFavorite:E,Labels:D,FavoriteLabel:O,FavoriteGlyph:k,isArchived:A,isAccepted:j,isFlagged:M,hasAccepted:N,hasFlagged:P,itemNumbers:F,items:I,AcceptText:L,FlagText:R,AcceptGlyph:z,FlagGlyph:B,RevealText:V,ArchiveText:H,revealControl:U,archiveControl:W,invokedAcceptItem:G,invokedFlagItem:K,Accept_ItemInvoked:se,Flag_ItemInvoked:ce,DeleteOne_ItemInvoked:le,lastListAction:q,listItemInvoked:J,DeleteItem_ItemInvoked:ue,ReplyAll_ItemInvoked:Y,Open_ItemInvoked:de,ListOutput:fe,lockInvoked:X,coffeeInvoked:Z,Lock_ItemInvoked:pe,Coffee_ItemInvoked:me,LockOutput:he,CoffeeOutput:ge,codePart:Q,RevealXaml:Q(ne),ExecuteXaml:Q(re),ListXaml:Q(ie),GradientXaml:Q(ae),IconsXaml:Q(oe),Border:b,Button:ee,ControlExample:S,FontIcon:u,ListView:T,Page:n,ScrollViewer:v,StackPanel:te,SwipeControl:C,TextBlock:g,ToggleButton:x};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function D(e,n,r,i,a,s){let c=o(`Setter`),l=o(`Style`),u=o(`FontIconSource`),d=o(`SwipeItem`),f=o(`SwipeItems`),p=o(`DataTemplate`),g=o(`GradientStop`),_=o(`LinearGradientBrush`),v=o(`BitmapIconSource`),b=o(`SwipeItem.IconSource`);return h(),y(i.Page,null,{default:t(()=>[m(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[m(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[m(i.StackPanel,{class:`page-heading`},{default:t(()=>[m(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`,HorizontalAlignment:`Right`},{default:t(()=>[m(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[m(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[m(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),m(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[m(i.StackPanel.Resources,null,{default:t(()=>[m(l,{TargetType:`ListViewItem`},{default:t(()=>[m(c,{Property:`Padding`,Value:`0`})]),_:1})]),_:1}),m(i.StackPanel,null,{default:t(()=>[m(i.ControlExample,{"x:Name":`Example1`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeRightRevealActions.txt`,HeaderText:`{x:Bind Labels.RevealHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RevealXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(i.Border,null,{default:t(()=>[m(i.Border.Resources,null,{default:t(()=>[m(u,{"x:Key":`AcceptIcon`,Glyph:`{x:Bind AcceptGlyph, Mode=OneWay}`}),m(u,{"x:Key":`FlagIcon`,Glyph:`{x:Bind FlagGlyph, Mode=OneWay}`}),m(f,{"x:Key":`left`,Mode:`Reveal`},{default:t(()=>[m(d,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource AcceptIcon}`,Invoked:`Accept_ItemInvoked`,Text:`{x:Bind AcceptText, Mode=OneWay}`}),m(d,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource FlagIcon}`,Invoked:`Flag_ItemInvoked`,Text:`{x:Bind FlagText, Mode=OneWay}`})]),_:1})]),_:1}),m(i.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:t(()=>[m(i.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output,null,{default:t(()=>[m(i.TextBlock,{Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example2`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeLeftInvokeExecute.txt`,HeaderText:`{x:Bind Labels.ExecuteHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ExecuteXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(i.Border,null,{default:t(()=>[m(i.Border.Resources,null,{default:t(()=>[m(u,{"x:Key":`ArchiveIcon`,Glyph:``}),m(f,{"x:Key":`right`,Mode:`Execute`},{default:t(()=>[m(d,{BehaviorOnInvoked:`Close`,IconSource:`{StaticResource ArchiveIcon}`,Invoked:`DeleteOne_ItemInvoked`,Text:`{x:Bind Labels.Archive, Mode=OneWay}`})]),_:1})]),_:1}),m(i.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:t(()=>[m(i.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output,null,{default:t(()=>[m(i.TextBlock,{Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example3`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomSwipeListview.txt`,HeaderText:`{x:Bind Labels.ListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ListXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(i.ListView,{"x:Name":`lv`,class:`swipe-list`,Width:`800`,Height:`300`,MinWidth:`200`,Margin:`12`,ItemsSource:`{x:Bind items, Mode=OneWay}`},{default:t(()=>[m(i.ListView.Resources,null,{default:t(()=>[m(u,{"x:Key":`ReplyAllIcon`,Glyph:``}),m(u,{"x:Key":`ReadIcon`,Glyph:``}),m(u,{"x:Key":`DeleteIcon`,Glyph:``}),m(f,{"x:Key":`left`,Mode:`Reveal`},{default:t(()=>[m(d,{Background:`#FF3e6fa7`,Foreground:`White`,IconSource:`{StaticResource ReplyAllIcon}`,Invoked:`ReplyAll_ItemInvoked`,Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`}),m(d,{Background:`#FFff9501`,Foreground:`White`,IconSource:`{StaticResource ReadIcon}`,Invoked:`Open_ItemInvoked`,Text:`{x:Bind Labels.Open, Mode=OneWay}`})]),_:1}),m(f,{"x:Key":`right`,Mode:`Execute`},{default:t(()=>[m(d,{Background:`Red`,IconSource:`{StaticResource DeleteIcon}`,Invoked:`DeleteItem_ItemInvoked`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1})]),_:1}),m(i.ListView.ItemTemplate,null,{default:t(()=>[m(p,null,{default:t(()=>[m(i.SwipeControl,{Height:`68`,MinWidth:`200`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`0,1,0,0`,LeftItems:`{StaticResource left}`,RightItems:`{StaticResource right}`},{default:t(()=>[m(i.TextBlock,{Margin:`12`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,FontSize:`24`,Text:`{Binding}`,TextTrimming:`CharacterEllipsis`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output,null,{default:t(()=>[m(i.TextBlock,{Text:`{x:Bind ListOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example4`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlGradientBackground.txt`,HeaderText:`{x:Bind Labels.GradientHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind GradientXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(i.Border,null,{default:t(()=>[m(i.Border.Resources,null,{default:t(()=>[m(u,{"x:Key":`LockIcon`,Glyph:``}),m(_,{"x:Key":`PurpleGradient`,StartPoint:`0,0.5`,EndPoint:`1,0.5`},{default:t(()=>[m(g,{Offset:`0.0`,Color:`#ff8990f9`}),m(g,{Offset:`0.5`,Color:`#ff5b66fb`}),m(g,{Offset:`1.0`,Color:`#ff5c1df4`})]),_:1}),m(f,{"x:Key":`right`,Mode:`Execute`},{default:t(()=>[m(d,{Background:`{StaticResource PurpleGradient}`,BehaviorOnInvoked:`Close`,IconSource:`{StaticResource LockIcon}`,Invoked:`Lock_ItemInvoked`,Text:`{x:Bind Labels.Lock, Mode=OneWay}`})]),_:1})]),_:1}),m(i.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:t(()=>[m(i.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeLeft, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output,null,{default:t(()=>[m(i.TextBlock,{Text:`{x:Bind LockOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example5`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:t(()=>[m(i.Border,null,{default:t(()=>[m(i.Border.Resources,null,{default:t(()=>[m(f,{"x:Key":`left`,Mode:`Reveal`},{default:t(()=>[m(d,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,Invoked:`Coffee_ItemInvoked`,Text:`{x:Bind Labels.Coffee, Mode=OneWay}`},{default:t(()=>[m(b,null,{default:t(()=>[m(v,{UriSource:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png`})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:t(()=>[m(i.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeRight, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output,null,{default:t(()=>[m(i.TextBlock,{Text:`{x:Bind CoffeeOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=a(E,[[`render`,D],[`__scopeId`,`data-v-fef6bec6`],[`__file`,`SwipeControlPage.vue`]]);export{O as default};