import{Ai as e,Bi as t,Cn as n,Mn as r,Yi as i,a,bi as o,ci as s,dr as c,fr as l,gi as u,ki as d,o as f,p,t as m,ui as h}from"./ScrollViewer-CHNE18MA.js";import{t as g}from"./Button-DO0TiUOq.js";import{t as _}from"./DropDownButton-COUmYCC8.js";import{t as v}from"./StackPanel-C60XOD66.js";import{n as y}from"./MenuFlyoutItems-Z4nCtluL.js";import{t as b}from"./ToggleButton-ZsjZg8Nu.js";import{t as x}from"./ControlExample-BKyw2NwY.js";import{t as S}from"./MenuFlyout-BEZZYoyH.js";import{t as C}from"./pageState-Djrh7EdY.js";var w=`--- header
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
</DropDownButton>`,T=`--- header
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
</DropDownButton>`,E=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,D={__name:`DropDownButtonPage`,setup(t,{expose:r}){r();let{t:u}=p(),d=o(`currentPage`),{isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k}=C(d?.value||`dropdownbutton`),A=i({});e(c,A);let j=s(()=>({PageTitle:u(`text.dropdownbutton`),Description:u(`text.a-dropdownbutton-is-a-button-that-displays-a-che`),ToggleTheme:u(`gallery.page-header.toggle-theme`),SimpleHeader:u(`sample.dropdownbutton.simple`),IconHeader:u(`sample.dropdownbutton.icons`),Email:u(`text.email`),Send:u(`text.send`),Reply:u(`text.reply`),ReplyAll:u(`text.reply-all`)})),M=s(()=>u(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=s(()=>h.value?``:``),P=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,F=P(w),I=P(T);e(l,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k,SimpleXaml:F,IconXaml:I,DropDownCSharp:E});let L={t:u,currentPage:d,isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k,Names:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,sampleXaml:P,SimpleXaml:F,IconXaml:I,computed:s,inject:o,provide:e,shallowReactive:i,Button:g,ControlExample:x,DropDownButton:_,FontIcon:a,MenuFlyout:S,get MenuFlyoutItem(){return y},Page:n,ScrollViewer:m,StackPanel:v,TextBlock:f,ToggleButton:b,get useI18n(){return p},get xamlNameScopeKey(){return c},get xamlScopeKey(){return l},get createPageState(){return C},get simpleDefinition(){return w},get iconDefinition(){return T},get DropDownCSharp(){return E}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}};function O(e,n,r,i,a,o){return d(),h(i.Page,null,{default:t(()=>[u(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[u(i.StackPanel,{class:`page-heading`},{default:t(()=>[u(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),u(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[u(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),u(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[u(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),u(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[u(i.ControlExample,{SampleDefinition:`DropDownButton\\DropDownButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.StackPanel,{"x:Name":`Control1`,Orientation:`Horizontal`},{default:t(()=>[u(i.DropDownButton,{Content:`{x:Bind Labels.Email, Mode=OneWay}`},{default:t(()=>[u(i.DropDownButton.Flyout,null,{default:t(()=>[u(i.MenuFlyout,{Placement:`BottomEdgeAlignedLeft`},{default:t(()=>[u(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Send, Mode=OneWay}`}),u(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reply, Mode=OneWay}`}),u(i.MenuFlyoutItem,{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output),u(i.ControlExample.Options)]),_:1}),u(i.ControlExample,{SampleDefinition:`DropDownButton\\DropDownButtonIcon.txt`,HeaderText:`{x:Bind Labels.IconHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.StackPanel,{"x:Name":`Control2`,Orientation:`Horizontal`},{default:t(()=>[u(i.DropDownButton,{"AutomationProperties.Name":`{x:Bind Labels.Email, Mode=OneWay}`},{default:t(()=>[u(i.DropDownButton.Content,null,{default:t(()=>[u(i.FontIcon,{Glyph:``})]),_:1}),u(i.DropDownButton.Flyout,null,{default:t(()=>[u(i.MenuFlyout,{Placement:`BottomEdgeAlignedLeft`},{default:t(()=>[u(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Send, Mode=OneWay}`},{default:t(()=>[u(i.MenuFlyoutItem.Icon,null,{default:t(()=>[u(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),u(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reply, Mode=OneWay}`},{default:t(()=>[u(i.MenuFlyoutItem.Icon,null,{default:t(()=>[u(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),u(i.MenuFlyoutItem,{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`},{default:t(()=>[u(i.MenuFlyoutItem.Icon,null,{default:t(()=>[u(i.FontIcon,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output),u(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=r(D,[[`render`,O],[`__scopeId`,`data-v-01dcef31`],[`__file`,`DropDownButtonPage.vue`]]);export{k as default};