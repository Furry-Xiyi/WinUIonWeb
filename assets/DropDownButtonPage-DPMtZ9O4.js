import{$i as e,Ai as t,Bi as n,Cn as r,Mn as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,o as p,p as m,t as h,ui as g}from"./ScrollViewer-B43ymvAj.js";import{t as _}from"./Button-B49t7g4C.js";import{t as v}from"./DropDownButton-D28dmjPt.js";import{t as y}from"./StackPanel-Dy6dKYi5.js";import{n as b}from"./MenuFlyoutItems-iTBXcIm-.js";import{t as x}from"./ToggleButton-DDZy2gVz.js";import{t as S}from"./ControlExample-Ddvmn5_c.js";import{t as C}from"./MenuFlyout-EhH1-tlz.js";import{t as w}from"./pageState-BQHW0me4.js";var T=`--- header
Simple DropDownButton
--- xaml
<DropDownButton Content="Email">
    <DropDownButton.Flyout>
        <MenuFlyout Placement="Bottom">
            <MenuFlyoutItem Text="Send"/>
            <MenuFlyoutItem Text="Reply"/>
            <MenuFlyoutItem Text="Reply All"/>
        </MenuFlyout>
    </DropDownButton.Flyout>
</DropDownButton>`,E=`--- header
DropDownButton with Icons
--- xaml
<DropDownButton AutomationProperties.Name="Email">
    <DropDownButton.Content>
        <FontIcon Glyph="&#xE715;"/>
    </DropDownButton.Content>
    <DropDownButton.Flyout>
        <MenuFlyout Placement="Bottom">
            <MenuFlyoutItem Text="Send">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE725;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Reply">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE8CA;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Reply All">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE8C2;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
        </MenuFlyout>
    </DropDownButton.Flyout>
</DropDownButton>`,D=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class DropDownButtonPage : Page
{
    public DropDownButtonPage()
    {
        this.InitializeComponent();
    }
}
`,O=i({__name:`DropDownButtonPage`,setup(i){let{t:O}=m(),{isFavoriteState:k,pageTheme:A,toggleTheme:j,toggleFavorite:M}=w(s(`currentPage`)?.value||`dropdownbutton`);t(l,a({}));let N=c(()=>({PageTitle:O(`text.dropdownbutton`),Description:O(`text.a-dropdownbutton-is-a-button-that-displays-a-che`),ToggleTheme:O(`gallery.page-header.toggle-theme`),SimpleHeader:O(`sample.dropdownbutton.simple`),IconHeader:O(`sample.dropdownbutton.icons`),Email:O(`text.email`),Send:O(`text.send`),Reply:O(`text.reply`),ReplyAll:O(`text.reply-all`)})),P=c(()=>O(k.value?`gallery.remove-favorite`:`gallery.add-favorite`)),F=c(()=>k.value?``:``),I=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``;return t(u,{Labels:N,FavoriteLabel:P,FavoriteGlyph:F,isFavoriteState:k,pageTheme:A,toggleTheme:j,toggleFavorite:M,SimpleXaml:I(T),IconXaml:I(E),DropDownCSharp:D}),(t,i)=>(f(),g(r,null,{default:n(()=>[d(h,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[d(y,{class:`gallery-item-page`},{default:n(()=>[d(y,{class:`page-heading`},{default:n(()=>[d(p,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(p,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(y,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[d(_,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[d(o,{Glyph:``,FontSize:`16`})]),_:1}),d(x,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[d(o,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),d(y,{class:`gallery-page-content`},{default:n(()=>[d(S,{SampleDefinition:`DropDownButton\\DropDownButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:n(()=>[d(S.Example,null,{default:n(()=>[d(y,{"x:Name":`Control1`,Orientation:`Horizontal`},{default:n(()=>[d(v,{Content:`{x:Bind Labels.Email, Mode=OneWay}`},{default:n(()=>[d(v.Flyout,null,{default:n(()=>[d(C,{Placement:`BottomEdgeAlignedLeft`},{default:n(()=>[d(e(b),{Text:`{x:Bind Labels.Send, Mode=OneWay}`}),d(e(b),{Text:`{x:Bind Labels.Reply, Mode=OneWay}`}),d(e(b),{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(S.Output),d(S.Options)]),_:1}),d(S,{SampleDefinition:`DropDownButton\\DropDownButtonIcon.txt`,HeaderText:`{x:Bind Labels.IconHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:n(()=>[d(S.Example,null,{default:n(()=>[d(y,{"x:Name":`Control2`,Orientation:`Horizontal`},{default:n(()=>[d(v,{"AutomationProperties.Name":`{x:Bind Labels.Email, Mode=OneWay}`},{default:n(()=>[d(v.Content,null,{default:n(()=>[d(o,{Glyph:``})]),_:1}),d(v.Flyout,null,{default:n(()=>[d(C,{Placement:`BottomEdgeAlignedLeft`},{default:n(()=>[d(e(b),{Text:`{x:Bind Labels.Send, Mode=OneWay}`},{default:n(()=>[d(e(b).Icon,null,{default:n(()=>[d(o,{Glyph:``})]),_:1})]),_:1}),d(e(b),{Text:`{x:Bind Labels.Reply, Mode=OneWay}`},{default:n(()=>[d(e(b).Icon,null,{default:n(()=>[d(o,{Glyph:``})]),_:1})]),_:1}),d(e(b),{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`},{default:n(()=>[d(e(b).Icon,null,{default:n(()=>[d(o,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(S.Output),d(S.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-01dcef31`]]);export{O as default};