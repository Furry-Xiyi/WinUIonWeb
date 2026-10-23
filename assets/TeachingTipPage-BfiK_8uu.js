import{Di as e,Ei as t,I as n,Ki as ee,Li as r,Lt as i,Nt as a,Wt as o,_i as s,ai as c,et as l,mi as u,o as d,oi as f,pi as p,si as m,sr as h,t as g}from"./ScrollViewer-BWDA_C78.js";import{t as _}from"./Button-BNDPNdYJ.js";import{t as v}from"./Image-i6y7QZ_e.js";import{t as te}from"./StackPanel-sg_Bd5oB.js";import{t as y}from"./TeachingTip-CES6iFK2.js";import{t as b}from"./ToggleButton-HP5wmrvH.js";import{t as x}from"./ControlExample-CzGyf8u0.js";import{t as S}from"./pageState-CcJibQcm.js";var C=`﻿<Button
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
</TeachingTip>`,w=`﻿private void TestButton1Click(object sender, RoutedEventArgs e)
{
    TestButton1TeachingTip.IsOpen = true;
}`,T=`﻿<Button
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
`,E=`﻿private void TestButton2Click(object sender, RoutedEventArgs e)
{
    TestButton2TeachingTip.IsOpen = true;
}`,D=`﻿<Button
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
`,O=`﻿private void TestButton3Click(object sender, RoutedEventArgs e)
{
    TestButton3TeachingTip.IsOpen = true;
}`,k=u({__name:`TeachingTipPage`,setup(t,{expose:r}){r();let{t:o}=l(),u=C,f=w,p=T,m=E,k=D,A=O,j=c(()=>o(`text.teachingtip`)),M=c(()=>o(`text.a-teaching-tip-is-a-notification-flyout-used-to`)),N=c(()=>o(`sample.teachingtip.targeted`)),P=c(()=>o(`sample.teachingtip.non-targeted`)),F=c(()=>o(`sample.teachingtip.hero`)),I=c(()=>o(`sample.teachingtip.title`)),L=c(()=>o(`sample.teachingtip.subtitle`)),R=c(()=>o(`sample.teachingtip.description`)),z=c(()=>o(`text.show-teachingtip`)),B=c(()=>o(`sample.teachingtip.action-button`)),V=c(()=>o(`sample.teachingtip.close-button`)),H=c(()=>o(`sample.teachingtip.sunset`)),U=c(()=>o(`sample.navigationview.change-theme`)),W=s(`currentPage`),G=c(()=>W?.value||`teachingtip`),{isFavoriteState:K,pageTheme:q,toggleTheme:J,toggleFavorite:Y}=S(G.value),X=c(()=>K.value?``:``),Z=c(()=>o(K.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),Q=ee({});e(h,Q);let $={t:o,TargetedXaml:u,TargetedCSharp:f,NonTargetedXaml:p,NonTargetedCSharp:m,HeroXaml:k,HeroCSharp:A,PageTitle:j,PageDescription:M,TargetedHeader:N,NonTargetedHeader:P,HeroHeader:F,TipTitle:I,TipSubtitle:L,TipDescription:R,ShowTipLabel:z,ActionButtonLabel:B,CloseButtonLabel:V,SunsetLabel:H,ThemeButtonLabel:U,currentPage:W,pageKey:G,isFavoriteState:K,pageTheme:q,toggleTheme:J,toggleFavorite:Y,favoriteGlyph:X,FavoriteButtonLabel:Z,namescope:Q,TestButton1Click:()=>{Q.TestButton1TeachingTip.IsOpen=!0},TestButton2Click:()=>{Q.TestButton2TeachingTip.IsOpen=!0},TestButton3Click:()=>{Q.TestButton3TeachingTip.IsOpen=!0},Button:_,ControlExample:x,Grid:i,Image:v,Page:n,ScrollViewer:g,StackPanel:te,SymbolIconSource:a,TeachingTip:y,TextBlock:d,ToggleButton:b};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}}),A={class:`gallery-item-page`},j={class:`page-heading`},M={class:`page-header-actions`};function N(e,n,ee,i,a,o){return t(),m(i.Page,null,{default:r(()=>[p(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[f(`div`,A,[f(`div`,j,[p(i.TextBlock,{class:`page-header`,Text:`{x:Bind PageTitle}`}),p(i.TextBlock,{class:`page-description`,Text:`{x:Bind PageDescription}`,TextWrapping:`WrapWholeWords`}),f(`div`,M,[p(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel}`,Click:`toggleTheme`},{default:r(()=>[p(i.TextBlock,{class:`icon`,Text:``})]),_:1}),p(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel}`,Click:`toggleFavorite`},{default:r(()=>[p(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})])]),p(i.StackPanel,{class:`gallery-page-content`},{default:r(()=>[p(i.ControlExample,{class:`teaching-tip-example`,SampleDefinition:`TeachingTip\\ShowTargetedTeachingtipButton.txt`,HeaderText:`{x:Bind TargetedHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TargetedXaml}`,CSharp:`{x:Bind TargetedCSharp}`},{default:r(()=>[p(i.ControlExample.Example,null,{default:r(()=>[p(i.Grid,null,{default:r(()=>[p(i.Button,{"x:Name":`TestButton1`,Click:`TestButton1Click`,Content:`{x:Bind ShowTipLabel}`}),p(i.TeachingTip,{"x:Name":`TestButton1TeachingTip`,Title:`{x:Bind TipTitle}`,Subtitle:`{x:Bind TipSubtitle}`,Target:`{x:Bind TestButton1}`},{default:r(()=>[p(i.TeachingTip.IconSource,null,{default:r(()=>[p(i.SymbolIconSource,{Symbol:`Refresh`})]),_:1})]),_:1})]),_:1})]),_:1}),p(i.ControlExample.Output),p(i.ControlExample.Options)]),_:1}),p(i.ControlExample,{class:`teaching-tip-example`,SampleDefinition:`TeachingTip\\ShowNonTargetedTeachingtip.txt`,HeaderText:`{x:Bind NonTargetedHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind NonTargetedXaml}`,CSharp:`{x:Bind NonTargetedCSharp}`},{default:r(()=>[p(i.ControlExample.Example,null,{default:r(()=>[p(i.Grid,null,{default:r(()=>[p(i.Button,{Click:`TestButton2Click`,Content:`{x:Bind ShowTipLabel}`}),p(i.TeachingTip,{"x:Name":`TestButton2TeachingTip`,Title:`{x:Bind TipTitle}`,ActionButtonContent:`{x:Bind ActionButtonLabel}`,CloseButtonContent:`{x:Bind CloseButtonLabel}`,IsLightDismissEnabled:`True`,PlacementMargin:`20`,PreferredPlacement:`Auto`,Subtitle:`{x:Bind TipSubtitle}`})]),_:1})]),_:1}),p(i.ControlExample.Output),p(i.ControlExample.Options)]),_:1}),p(i.ControlExample,{class:`teaching-tip-example teaching-tip-hero-example`,SampleDefinition:`TeachingTip\\ShowTargetedTeachingtipHero.txt`,HeaderText:`{x:Bind HeroHeader}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind HeroXaml}`,CSharp:`{x:Bind HeroCSharp}`},{default:r(()=>[p(i.ControlExample.Example,null,{default:r(()=>[p(i.Grid,null,{default:r(()=>[p(i.Button,{"x:Name":`TestButton3`,Click:`TestButton3Click`,Content:`{x:Bind ShowTipLabel}`}),p(i.TeachingTip,{"x:Name":`TestButton3TeachingTip`,Title:`{x:Bind TipTitle}`,PreferredPlacement:`Bottom`,Subtitle:`{x:Bind TipSubtitle}`,Target:`{x:Bind TestButton3}`},{default:r(()=>[p(i.TeachingTip.HeroContent,null,{default:r(()=>[p(i.Image,{"AutomationProperties.Name":`{x:Bind SunsetLabel}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg`})]),_:1}),p(i.TeachingTip.Content,null,{default:r(()=>[p(i.TextBlock,{Margin:`0,16,0,0`,Text:`{x:Bind TipDescription}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),p(i.ControlExample.Output),p(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var P=o(k,[[`render`,N],[`__scopeId`,`data-v-8f916af0`],[`__file`,`TeachingTipPage.vue`]]);export{P as default};