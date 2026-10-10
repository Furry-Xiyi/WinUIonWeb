import{Fi as e,I as t,Lt as n,Nt as r,Ti as i,Wi as a,Wt as o,ai as s,di as c,et as l,fi as u,hi as d,ii as f,o as p,or as m,ri as h,t as g,wi as _}from"./ScrollViewer-PoO_ma9Z.js";import{t as v}from"./Button-DjU0urmJ.js";import{t as y}from"./Image-Bse8ORbC.js";import{t as b}from"./StackPanel-CT7pl8zy.js";import{t as ee}from"./TeachingTip-tJXGGY6i.js";import{t as x}from"./ToggleButton-DwmhXZge.js";import{t as S}from"./ControlExample-C1ahTZEr.js";import{t as C}from"./pageState-BN3kXI7L.js";var w=`﻿<Button
    x:Name="TestButton1"
    Click="TestButton1Click"
    Content="Show TeachingTip" />
<TeachingTip
    x:Name="TestButton1TeachingTip"
    Title="This is the title"
    Subtitle="And this is the subtitle"
    Target="{x:Bind TestButton1}">
    <TeachingTip.IconSource>
        <SymbolIconSource Symbol="Refresh" />
    </TeachingTip.IconSource>
</TeachingTip>`,T=`﻿private void TestButton1Click(object sender, RoutedEventArgs e)
{
    TestButton1TeachingTip.IsOpen = true;
}`,E=`﻿<Button
    Click="TestButton2Click"
    Content="Show TeachingTip" />
<TeachingTip
    x:Name="TestButton2TeachingTip"
    Title="This is the title"
    ActionButtonContent="Action button"
    CloseButtonContent="Close button"
    IsLightDismissEnabled="True"
    PlacementMargin="20"
    PreferredPlacement="Auto"
    Subtitle="And this is the subtitle" />
`,D=`﻿private void TestButton2Click(object sender, RoutedEventArgs e)
{
    TestButton2TeachingTip.IsOpen = true;
}`,O=`﻿<Button
    x:Name="TestButton3"
    Click="TestButton3Click"
    Content="Show TeachingTip" />
<TeachingTip
    x:Name="TestButton3TeachingTip"
    Title="This is the title"
    PreferredPlacement="Bottom"
    Subtitle="And this is the subtitle"
    Target="{x:Bind TestButton3}">
    <TeachingTip.HeroContent>
        <Image
            AutomationProperties.Name="Sunset"
            Source="/Assets/SampleMedia/sunset.jpg" />
    </TeachingTip.HeroContent>
    <TeachingTip.Content>
        <TextBlock
            Margin="0,16,0,0"
            Text="Description can go here"
            TextWrapping="WrapWholeWords" />
    </TeachingTip.Content>
</TeachingTip>
`,k=`﻿private void TestButton3Click(object sender, RoutedEventArgs e)
{
    TestButton3TeachingTip.IsOpen = true;
}`,A=u({__name:`TeachingTipPage`,setup(e,{expose:o}){o();let{t:s}=l(),c=w,u=T,f=E,_=D,A=O,j=k,M=h(()=>s(`text.teachingtip`)),N=h(()=>s(`text.a-teaching-tip-is-a-notification-flyout-used-to`)),P=h(()=>s(`sample.teachingtip.targeted`)),F=h(()=>s(`sample.teachingtip.non-targeted`)),te=h(()=>s(`sample.teachingtip.hero`)),I=h(()=>s(`sample.teachingtip.title`)),L=h(()=>s(`sample.teachingtip.subtitle`)),R=h(()=>s(`sample.teachingtip.description`)),z=h(()=>s(`text.show-teachingtip`)),B=h(()=>s(`sample.teachingtip.action-button`)),V=h(()=>s(`sample.teachingtip.close-button`)),H=h(()=>s(`sample.teachingtip.sunset`)),U=h(()=>s(`sample.navigationview.change-theme`)),W=d(`currentPage`),G=h(()=>W?.value||`teachingtip`),{isFavoriteState:K,pageTheme:q,toggleTheme:J,toggleFavorite:Y}=C(G.value),X=h(()=>K.value?``:``),Z=h(()=>s(K.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),Q=a({});i(m,Q);let $={t:s,TargetedXaml:c,TargetedCSharp:u,NonTargetedXaml:f,NonTargetedCSharp:_,HeroXaml:A,HeroCSharp:j,PageTitle:M,PageDescription:N,TargetedHeader:P,NonTargetedHeader:F,HeroHeader:te,TipTitle:I,TipSubtitle:L,TipDescription:R,ShowTipLabel:z,ActionButtonLabel:B,CloseButtonLabel:V,SunsetLabel:H,ThemeButtonLabel:U,currentPage:W,pageKey:G,isFavoriteState:K,pageTheme:q,toggleTheme:J,toggleFavorite:Y,favoriteGlyph:X,FavoriteButtonLabel:Z,namescope:Q,TestButton1Click:()=>{Q.TestButton1TeachingTip.IsOpen=!0},TestButton2Click:()=>{Q.TestButton2TeachingTip.IsOpen=!0},TestButton3Click:()=>{Q.TestButton3TeachingTip.IsOpen=!0},Button:v,ControlExample:S,Grid:n,Image:y,Page:t,ScrollViewer:g,StackPanel:b,SymbolIconSource:r,TeachingTip:ee,TextBlock:p,ToggleButton:x};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}}),j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(t,n,r,i,a,o){return _(),s(i.Page,null,{default:e(()=>[c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[f(`div`,j,[f(`div`,M,[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind PageTitle}`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind PageDescription}`,TextWrapping:`WrapWholeWords`}),f(`div`,N,[c(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel}`,Click:`toggleTheme`},{default:e(()=>[c(i.TextBlock,{class:`icon`,Text:``})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel}`,Click:`toggleFavorite`},{default:e(()=>[c(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})])]),c(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(i.ControlExample,{class:`teaching-tip-example`,SampleDefinition:`TeachingTip\\ShowTargetedTeachingtipButton.txt`,HeaderText:`{x:Bind TargetedHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TargetedXaml}`,CSharp:`{x:Bind TargetedCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Grid,null,{default:e(()=>[c(i.Button,{"x:Name":`TestButton1`,Click:`TestButton1Click`,Content:`{x:Bind ShowTipLabel}`}),c(i.TeachingTip,{"x:Name":`TestButton1TeachingTip`,Title:`{x:Bind TipTitle}`,Subtitle:`{x:Bind TipSubtitle}`,Target:`{x:Bind TestButton1}`},{default:e(()=>[c(i.TeachingTip.IconSource,null,{default:e(()=>[c(i.SymbolIconSource,{Symbol:`Refresh`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{class:`teaching-tip-example`,SampleDefinition:`TeachingTip\\ShowNonTargetedTeachingtip.txt`,HeaderText:`{x:Bind NonTargetedHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind NonTargetedXaml}`,CSharp:`{x:Bind NonTargetedCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Grid,null,{default:e(()=>[c(i.Button,{Click:`TestButton2Click`,Content:`{x:Bind ShowTipLabel}`}),c(i.TeachingTip,{"x:Name":`TestButton2TeachingTip`,Title:`{x:Bind TipTitle}`,ActionButtonContent:`{x:Bind ActionButtonLabel}`,CloseButtonContent:`{x:Bind CloseButtonLabel}`,IsLightDismissEnabled:`True`,PlacementMargin:`20`,PreferredPlacement:`Auto`,Subtitle:`{x:Bind TipSubtitle}`})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{class:`teaching-tip-example teaching-tip-hero-example`,SampleDefinition:`TeachingTip\\ShowTargetedTeachingtipHero.txt`,HeaderText:`{x:Bind HeroHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind HeroXaml}`,CSharp:`{x:Bind HeroCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Grid,null,{default:e(()=>[c(i.Button,{"x:Name":`TestButton3`,Click:`TestButton3Click`,Content:`{x:Bind ShowTipLabel}`}),c(i.TeachingTip,{"x:Name":`TestButton3TeachingTip`,Title:`{x:Bind TipTitle}`,PreferredPlacement:`Bottom`,Subtitle:`{x:Bind TipSubtitle}`,Target:`{x:Bind TestButton3}`},{default:e(()=>[c(i.TeachingTip.HeroContent,null,{default:e(()=>[c(i.Image,{"AutomationProperties.Name":`{x:Bind SunsetLabel}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg`})]),_:1}),c(i.TeachingTip.Content,null,{default:e(()=>[c(i.TextBlock,{Margin:`0,16,0,0`,Text:`{x:Bind TipDescription}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var F=o(A,[[`render`,P],[`__scopeId`,`data-v-8f916af0`],[`__file`,`TeachingTipPage.vue`]]);export{F as default};