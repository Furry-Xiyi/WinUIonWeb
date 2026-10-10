import{$ as e,Ai as t,Bi as n,Cn as r,En as i,Mn as a,Yi as o,_i as s,bi as c,ci as l,dr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-CHNE18MA.js";import{t as v}from"./Button-DO0TiUOq.js";import{t as y}from"./Image-BKiqvBIm.js";import{t as b}from"./StackPanel-C60XOD66.js";import{t as ee}from"./ToggleButton-ZsjZg8Nu.js";import{t as x}from"./ControlExample-BKyw2NwY.js";import{t as S}from"./TeachingTip-C-e671F2.js";import{t as C}from"./pageState-Djrh7EdY.js";var w=`﻿<Button
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
}`,A=s({__name:`TeachingTipPage`,setup(n,{expose:a}){a();let{t:s}=h(),d=w,f=T,p=E,_=D,A=O,j=k,M=l(()=>s(`text.teachingtip`)),N=l(()=>s(`text.a-teaching-tip-is-a-notification-flyout-used-to`)),P=l(()=>s(`sample.teachingtip.targeted`)),F=l(()=>s(`sample.teachingtip.non-targeted`)),te=l(()=>s(`sample.teachingtip.hero`)),I=l(()=>s(`sample.teachingtip.title`)),L=l(()=>s(`sample.teachingtip.subtitle`)),R=l(()=>s(`sample.teachingtip.description`)),z=l(()=>s(`text.show-teachingtip`)),B=l(()=>s(`sample.teachingtip.action-button`)),V=l(()=>s(`sample.teachingtip.close-button`)),H=l(()=>s(`sample.teachingtip.sunset`)),U=l(()=>s(`sample.navigationview.change-theme`)),W=c(`currentPage`),G=l(()=>W?.value||`teachingtip`),{isFavoriteState:K,pageTheme:q,toggleTheme:J,toggleFavorite:Y}=C(G.value),X=l(()=>K.value?``:``),Z=l(()=>s(K.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),Q=o({});t(u,Q);let $={t:s,TargetedXaml:d,TargetedCSharp:f,NonTargetedXaml:p,NonTargetedCSharp:_,HeroXaml:A,HeroCSharp:j,PageTitle:M,PageDescription:N,TargetedHeader:P,NonTargetedHeader:F,HeroHeader:te,TipTitle:I,TipSubtitle:L,TipDescription:R,ShowTipLabel:z,ActionButtonLabel:B,CloseButtonLabel:V,SunsetLabel:H,ThemeButtonLabel:U,currentPage:W,pageKey:G,isFavoriteState:K,pageTheme:q,toggleTheme:J,toggleFavorite:Y,favoriteGlyph:X,FavoriteButtonLabel:Z,namescope:Q,TestButton1Click:()=>{Q.TestButton1TeachingTip.IsOpen=!0},TestButton2Click:()=>{Q.TestButton2TeachingTip.IsOpen=!0},TestButton3Click:()=>{Q.TestButton3TeachingTip.IsOpen=!0},Button:v,ControlExample:x,Grid:i,Image:y,Page:r,ScrollViewer:g,StackPanel:b,SymbolIconSource:e,TeachingTip:S,TextBlock:m,ToggleButton:ee};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}}),j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(e,t,r,i,a,o){return f(),_(i.Page,null,{default:n(()=>[d(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[p(`div`,j,[p(`div`,M,[d(i.TextBlock,{class:`page-header`,Text:`{x:Bind PageTitle}`}),d(i.TextBlock,{class:`page-description`,Text:`{x:Bind PageDescription}`,TextWrapping:`WrapWholeWords`}),p(`div`,N,[d(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel}`,Click:`toggleTheme`},{default:n(()=>[d(i.TextBlock,{class:`icon`,Text:``})]),_:1}),d(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel}`,Click:`toggleFavorite`},{default:n(()=>[d(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})])]),d(i.StackPanel,{class:`gallery-page-content`},{default:n(()=>[d(i.ControlExample,{class:`teaching-tip-example`,SampleDefinition:`TeachingTip\\ShowTargetedTeachingtipButton.txt`,HeaderText:`{x:Bind TargetedHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TargetedXaml}`,CSharp:`{x:Bind TargetedCSharp}`},{default:n(()=>[d(i.ControlExample.Example,null,{default:n(()=>[d(i.Grid,null,{default:n(()=>[d(i.Button,{"x:Name":`TestButton1`,Click:`TestButton1Click`,Content:`{x:Bind ShowTipLabel}`}),d(i.TeachingTip,{"x:Name":`TestButton1TeachingTip`,Title:`{x:Bind TipTitle}`,Subtitle:`{x:Bind TipSubtitle}`,Target:`{x:Bind TestButton1}`},{default:n(()=>[d(i.TeachingTip.IconSource,null,{default:n(()=>[d(i.SymbolIconSource,{Symbol:`Refresh`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{class:`teaching-tip-example`,SampleDefinition:`TeachingTip\\ShowNonTargetedTeachingtip.txt`,HeaderText:`{x:Bind NonTargetedHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind NonTargetedXaml}`,CSharp:`{x:Bind NonTargetedCSharp}`},{default:n(()=>[d(i.ControlExample.Example,null,{default:n(()=>[d(i.Grid,null,{default:n(()=>[d(i.Button,{Click:`TestButton2Click`,Content:`{x:Bind ShowTipLabel}`}),d(i.TeachingTip,{"x:Name":`TestButton2TeachingTip`,Title:`{x:Bind TipTitle}`,ActionButtonContent:`{x:Bind ActionButtonLabel}`,CloseButtonContent:`{x:Bind CloseButtonLabel}`,IsLightDismissEnabled:`True`,PlacementMargin:`20`,PreferredPlacement:`Auto`,Subtitle:`{x:Bind TipSubtitle}`})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{class:`teaching-tip-example teaching-tip-hero-example`,SampleDefinition:`TeachingTip\\ShowTargetedTeachingtipHero.txt`,HeaderText:`{x:Bind HeroHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind HeroXaml}`,CSharp:`{x:Bind HeroCSharp}`},{default:n(()=>[d(i.ControlExample.Example,null,{default:n(()=>[d(i.Grid,null,{default:n(()=>[d(i.Button,{"x:Name":`TestButton3`,Click:`TestButton3Click`,Content:`{x:Bind ShowTipLabel}`}),d(i.TeachingTip,{"x:Name":`TestButton3TeachingTip`,Title:`{x:Bind TipTitle}`,PreferredPlacement:`Bottom`,Subtitle:`{x:Bind TipSubtitle}`,Target:`{x:Bind TestButton3}`},{default:n(()=>[d(i.TeachingTip.HeroContent,null,{default:n(()=>[d(i.Image,{"AutomationProperties.Name":`{x:Bind SunsetLabel}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg`})]),_:1}),d(i.TeachingTip.Content,null,{default:n(()=>[d(i.TextBlock,{Margin:`0,16,0,0`,Text:`{x:Bind TipDescription}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var F=a(A,[[`render`,P],[`__scopeId`,`data-v-8f916af0`],[`__file`,`TeachingTipPage.vue`]]);export{F as default};