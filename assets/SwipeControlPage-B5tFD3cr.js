import{Ai as e,Di as t,Ei as n,Gi as r,I as i,Ki as a,Li as o,Pi as s,Wt as c,_i as l,a as u,ai as d,et as f,mi as p,o as m,pi as h,qi as g,si as _,sr as v,t as y}from"./ScrollViewer-BWDA_C78.js";import{n as b}from"./ContentPresenter-DMSXUCwi.js";import{t as x}from"./Button-BNDPNdYJ.js";import{t as S}from"./StackPanel-sg_Bd5oB.js";import{t as C}from"./ListView-DiQ0PqAw.js";import{t as w}from"./SwipeControl-8tGpGtbA.js";import{t as T}from"./ToggleButton-HP5wmrvH.js";import{t as ee}from"./ControlExample-CzGyf8u0.js";import{t as te}from"./pageState-CcJibQcm.js";var ne=`--- header
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
`,E=p({__name:`SwipeControlPage`,setup(e,{expose:n}){n();let{t:o}=f(),c=l(`currentPage`),{isFavoriteState:p,pageTheme:h,toggleTheme:_,toggleFavorite:E}=te(c?.value||`swipecontrol`);t(v,a({}));let D=d(()=>({PageTitle:o(`text.swipecontrol`),Description:o(`text.swipecontrol-subtitle`),ToggleTheme:o(`gallery.page-header.toggle-theme`),RevealHeader:o(`sample.swipecontrol.reveal-actions`),ExecuteHeader:o(`sample.swipecontrol.execute`),ListHeader:o(`sample.swipecontrol.custom-list`),GradientHeader:o(`sample.swipecontrol.gradient`),IconsHeader:o(`sample.swipecontrol.custom-icons`),SwipeRight:o(`sample.swipecontrol.swipe-right`),SwipeLeft:o(`sample.swipecontrol.swipe-left`),Archive:o(`sample.swipecontrol.archive`),ReplyAll:o(`sample.swipecontrol.reply-all`),Open:o(`sample.swipecontrol.open`),Delete:o(`sample.swipecontrol.delete`),Lock:o(`sample.swipecontrol.lock`),Coffee:o(`sample.swipecontrol.coffee`)})),O=d(()=>o(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),k=d(()=>p.value?``:``),A=r(!1),j=r(!1),M=r(!1),N=r(!1),P=r(!1),F=r([1,2,3,4]),I=d(()=>F.value.map(e=>o(`sample.swipecontrol.list-item`,{index:e}))),L=d(()=>o(j.value?`sample.swipecontrol.cancel`:`sample.swipecontrol.accept`)),R=d(()=>o(M.value?`sample.swipecontrol.unmark`:`sample.swipecontrol.flag`)),z=d(()=>j.value?``:N.value?``:``),B=d(()=>M.value?``:P.value?``:``),V=d(()=>o(j.value?M.value?`sample.swipecontrol.accepted-flagged`:`sample.swipecontrol.accepted`:M.value?`sample.swipecontrol.flagged`:`sample.swipecontrol.swipe-right`)),H=d(()=>o(A.value?`sample.swipecontrol.archived`:`sample.swipecontrol.swipe-left`)),U=g(),W=g(),G=g(),K=g();s(V,e=>{U.value&&(U.value.Content.Text=e)}),s(H,e=>{W.value&&(W.value.Content.Text=e)}),s(L,e=>{G.value&&(G.value.Text=e)}),s(R,e=>{K.value&&(K.value.Text=e)});function se(e,t){U.value=t.SwipeControl,G.value=e,j.value=!j.value,N.value=!0,t.SwipeControl.Content.Text=V.value,e.IconSource={Glyph:z.value},e.Text=L.value}function ce(e,t){U.value=t.SwipeControl,K.value=e,M.value=!M.value,P.value=!0,t.SwipeControl.Content.Text=V.value,e.IconSource={Glyph:B.value},e.Text=R.value}function le(e,t){W.value=t.SwipeControl,A.value=!A.value,t.SwipeControl.Content.Text=H.value}let q=r(null);function J(e,t){let n=I.value.indexOf(t.SwipeControl.DataContext);n<0||(q.value={action:e,index:F.value[n]},e===`delete`&&F.value.splice(n,1))}function ue(e,t){J(`delete`,t)}function Y(e,t){J(`reply-all`,t)}function de(e,t){J(`open`,t)}let fe=d(()=>q.value?o(`sample.swipecontrol.item-action-output`,{action:o(`sample.swipecontrol.${q.value.action}`),item:o(`sample.swipecontrol.list-item`,{index:q.value.index}),count:I.value.length}):o(`sample.swipecontrol.remaining-items`,{count:I.value.length})),X=r(!1),Z=r(!1);function pe(){X.value=!0}function me(){Z.value=!0}let he=d(()=>X.value?o(`sample.swipecontrol.lock-invoked`):``),ge=d(()=>Z.value?o(`sample.swipecontrol.coffee-invoked`):``),Q=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0]?.trim()??``,$={t:o,currentPage:c,isFavoriteState:p,pageTheme:h,toggleTheme:_,toggleFavorite:E,Labels:D,FavoriteLabel:O,FavoriteGlyph:k,isArchived:A,isAccepted:j,isFlagged:M,hasAccepted:N,hasFlagged:P,itemNumbers:F,items:I,AcceptText:L,FlagText:R,AcceptGlyph:z,FlagGlyph:B,RevealText:V,ArchiveText:H,revealControl:U,archiveControl:W,invokedAcceptItem:G,invokedFlagItem:K,Accept_ItemInvoked:se,Flag_ItemInvoked:ce,DeleteOne_ItemInvoked:le,lastListAction:q,listItemInvoked:J,DeleteItem_ItemInvoked:ue,ReplyAll_ItemInvoked:Y,Open_ItemInvoked:de,ListOutput:fe,lockInvoked:X,coffeeInvoked:Z,Lock_ItemInvoked:pe,Coffee_ItemInvoked:me,LockOutput:he,CoffeeOutput:ge,codePart:Q,RevealXaml:Q(ne),ExecuteXaml:Q(re),ListXaml:Q(ie),GradientXaml:Q(ae),IconsXaml:Q(oe),Border:b,Button:x,ControlExample:ee,FontIcon:u,ListView:C,Page:i,ScrollViewer:y,StackPanel:S,SwipeControl:w,TextBlock:m,ToggleButton:T};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function D(t,r,i,a,s,c){let l=e(`Setter`),u=e(`Style`),d=e(`FontIconSource`),f=e(`SwipeItem`),p=e(`SwipeItems`),m=e(`DataTemplate`),g=e(`GradientStop`),v=e(`LinearGradientBrush`),y=e(`BitmapIconSource`),b=e(`SwipeItem.IconSource`);return n(),_(a.Page,null,{default:o(()=>[h(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:o(()=>[h(a.StackPanel,{class:`gallery-item-page`},{default:o(()=>[h(a.StackPanel,{class:`page-heading`},{default:o(()=>[h(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),h(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),h(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`,HorizontalAlignment:`Right`},{default:o(()=>[h(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:o(()=>[h(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),h(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:o(()=>[h(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),h(a.StackPanel,{class:`gallery-page-content`},{default:o(()=>[h(a.StackPanel.Resources,null,{default:o(()=>[h(u,{TargetType:`ListViewItem`},{default:o(()=>[h(l,{Property:`Padding`,Value:`0`})]),_:1})]),_:1}),h(a.StackPanel,null,{default:o(()=>[h(a.ControlExample,{"x:Name":`Example1`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeRightRevealActions.txt`,HeaderText:`{x:Bind Labels.RevealHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RevealXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:o(()=>[h(a.ControlExample.Example,null,{default:o(()=>[h(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:o(()=>[h(a.Border,null,{default:o(()=>[h(a.Border.Resources,null,{default:o(()=>[h(d,{"x:Key":`AcceptIcon`,Glyph:`{x:Bind AcceptGlyph, Mode=OneWay}`}),h(d,{"x:Key":`FlagIcon`,Glyph:`{x:Bind FlagGlyph, Mode=OneWay}`}),h(p,{"x:Key":`left`,Mode:`Reveal`},{default:o(()=>[h(f,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource AcceptIcon}`,Invoked:`Accept_ItemInvoked`,Text:`{x:Bind AcceptText, Mode=OneWay}`}),h(f,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,IconSource:`{StaticResource FlagIcon}`,Invoked:`Flag_ItemInvoked`,Text:`{x:Bind FlagText, Mode=OneWay}`})]),_:1})]),_:1}),h(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:o(()=>[h(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),h(a.ControlExample.Output,null,{default:o(()=>[h(a.TextBlock,{Text:`{x:Bind RevealText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),h(a.ControlExample.Options)]),_:1}),h(a.ControlExample,{"x:Name":`Example2`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlSwipeLeftInvokeExecute.txt`,HeaderText:`{x:Bind Labels.ExecuteHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ExecuteXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:o(()=>[h(a.ControlExample.Example,null,{default:o(()=>[h(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:o(()=>[h(a.Border,null,{default:o(()=>[h(a.Border.Resources,null,{default:o(()=>[h(d,{"x:Key":`ArchiveIcon`,Glyph:``}),h(p,{"x:Key":`right`,Mode:`Execute`},{default:o(()=>[h(f,{BehaviorOnInvoked:`Close`,IconSource:`{StaticResource ArchiveIcon}`,Invoked:`DeleteOne_ItemInvoked`,Text:`{x:Bind Labels.Archive, Mode=OneWay}`})]),_:1})]),_:1}),h(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:o(()=>[h(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),h(a.ControlExample.Output,null,{default:o(()=>[h(a.TextBlock,{Text:`{x:Bind ArchiveText, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),h(a.ControlExample.Options)]),_:1}),h(a.ControlExample,{"x:Name":`Example3`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomSwipeListview.txt`,HeaderText:`{x:Bind Labels.ListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ListXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:o(()=>[h(a.ControlExample.Example,null,{default:o(()=>[h(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:o(()=>[h(a.ListView,{"x:Name":`lv`,class:`swipe-list`,Width:`800`,Height:`300`,MinWidth:`200`,Margin:`12`,ItemsSource:`{x:Bind items, Mode=OneWay}`},{default:o(()=>[h(a.ListView.Resources,null,{default:o(()=>[h(d,{"x:Key":`ReplyAllIcon`,Glyph:``}),h(d,{"x:Key":`ReadIcon`,Glyph:``}),h(d,{"x:Key":`DeleteIcon`,Glyph:``}),h(p,{"x:Key":`left`,Mode:`Reveal`},{default:o(()=>[h(f,{Background:`#FF3e6fa7`,Foreground:`White`,IconSource:`{StaticResource ReplyAllIcon}`,Invoked:`ReplyAll_ItemInvoked`,Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`}),h(f,{Background:`#FFff9501`,Foreground:`White`,IconSource:`{StaticResource ReadIcon}`,Invoked:`Open_ItemInvoked`,Text:`{x:Bind Labels.Open, Mode=OneWay}`})]),_:1}),h(p,{"x:Key":`right`,Mode:`Execute`},{default:o(()=>[h(f,{Background:`Red`,IconSource:`{StaticResource DeleteIcon}`,Invoked:`DeleteItem_ItemInvoked`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1})]),_:1}),h(a.ListView.ItemTemplate,null,{default:o(()=>[h(m,null,{default:o(()=>[h(a.SwipeControl,{Height:`68`,MinWidth:`200`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`0,1,0,0`,LeftItems:`{StaticResource left}`,RightItems:`{StaticResource right}`},{default:o(()=>[h(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Stretch`,VerticalAlignment:`Center`,FontSize:`24`,Text:`{Binding}`,TextTrimming:`CharacterEllipsis`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),h(a.ControlExample.Output,null,{default:o(()=>[h(a.TextBlock,{Text:`{x:Bind ListOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),h(a.ControlExample.Options)]),_:1}),h(a.ControlExample,{"x:Name":`Example4`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlGradientBackground.txt`,HeaderText:`{x:Bind Labels.GradientHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind GradientXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:o(()=>[h(a.ControlExample.Example,null,{default:o(()=>[h(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:o(()=>[h(a.Border,null,{default:o(()=>[h(a.Border.Resources,null,{default:o(()=>[h(d,{"x:Key":`LockIcon`,Glyph:``}),h(v,{"x:Key":`PurpleGradient`,StartPoint:`0,0.5`,EndPoint:`1,0.5`},{default:o(()=>[h(g,{Offset:`0.0`,Color:`#ff8990f9`}),h(g,{Offset:`0.5`,Color:`#ff5b66fb`}),h(g,{Offset:`1.0`,Color:`#ff5c1df4`})]),_:1}),h(p,{"x:Key":`right`,Mode:`Execute`},{default:o(()=>[h(f,{Background:`{StaticResource PurpleGradient}`,BehaviorOnInvoked:`Close`,IconSource:`{StaticResource LockIcon}`,Invoked:`Lock_ItemInvoked`,Text:`{x:Bind Labels.Lock, Mode=OneWay}`})]),_:1})]),_:1}),h(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,RightItems:`{StaticResource right}`},{default:o(()=>[h(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeLeft, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),h(a.ControlExample.Output,null,{default:o(()=>[h(a.TextBlock,{Text:`{x:Bind LockOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),h(a.ControlExample.Options)]),_:1}),h(a.ControlExample,{"x:Name":`Example5`,class:`swipe-example`,SampleDefinition:`SwipeControl\\SwipeControlCustomIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`,CSharp:`{x:Bind SwipeControlCSharp}`},{default:o(()=>[h(a.ControlExample.Example,null,{default:o(()=>[h(a.ScrollViewer,{class:`swipe-example-host`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Disabled`,VerticalScrollMode:`Disabled`,Padding:`0`},{default:o(()=>[h(a.Border,null,{default:o(()=>[h(a.Border.Resources,null,{default:o(()=>[h(p,{"x:Key":`left`,Mode:`Reveal`},{default:o(()=>[h(f,{Background:`{ThemeResource ButtonBackgroundThemeBrush}`,Foreground:`{ThemeResource AppBarItemForegroundThemeBrush}`,Invoked:`Coffee_ItemInvoked`,Text:`{x:Bind Labels.Coffee, Mode=OneWay}`},{default:o(()=>[h(b,null,{default:o(()=>[h(y,{UriSource:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/CoffeeCup.png`})]),_:1})]),_:1})]),_:1})]),_:1}),h(a.SwipeControl,{Width:`500`,Height:`68`,Margin:`12`,BorderBrush:`{ThemeResource ButtonBackground}`,BorderThickness:`1`,LeftItems:`{StaticResource left}`},{default:o(()=>[h(a.TextBlock,{Margin:`12`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.SwipeRight, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1})]),_:1})]),_:1}),h(a.ControlExample.Output,null,{default:o(()=>[h(a.TextBlock,{Text:`{x:Bind CoffeeOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),h(a.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var O=c(E,[[`render`,D],[`__scopeId`,`data-v-fef6bec6`],[`__file`,`SwipeControlPage.vue`]]);export{O as default};