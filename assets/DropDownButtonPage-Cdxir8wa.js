import{Di as e,Ei as t,I as n,Ki as r,Li as i,Wt as a,_i as o,a as s,ai as c,cr as l,et as u,o as d,pi as f,si as p,sr as m,t as h}from"./ScrollViewer-BWDA_C78.js";import{t as g}from"./Button-BNDPNdYJ.js";import{t as _}from"./DropDownButton-DWl2j9c9.js";import{t as v}from"./StackPanel-sg_Bd5oB.js";import{n as y}from"./MenuFlyoutItems-RkThyUiU.js";import{t as b}from"./MenuFlyout-CQtMsdJa.js";import{t as x}from"./ToggleButton-HP5wmrvH.js";import{t as S}from"./ControlExample-CzGyf8u0.js";import{t as C}from"./pageState-CcJibQcm.js";var w=`--- header
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
`,D={__name:`DropDownButtonPage`,setup(t,{expose:i}){i();let{t:a}=u(),f=o(`currentPage`),{isFavoriteState:p,pageTheme:D,toggleTheme:O,toggleFavorite:k}=C(f?.value||`dropdownbutton`),A=r({});e(m,A);let j=c(()=>({PageTitle:a(`text.dropdownbutton`),Description:a(`text.a-dropdownbutton-is-a-button-that-displays-a-che`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`sample.dropdownbutton.simple`),IconHeader:a(`sample.dropdownbutton.icons`),Email:a(`text.email`),Send:a(`text.send`),Reply:a(`text.reply`),ReplyAll:a(`text.reply-all`)})),M=c(()=>a(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=c(()=>p.value?``:``),P=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,F=P(w),I=P(T);e(l,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:p,pageTheme:D,toggleTheme:O,toggleFavorite:k,SimpleXaml:F,IconXaml:I,DropDownCSharp:E});let L={t:a,currentPage:f,isFavoriteState:p,pageTheme:D,toggleTheme:O,toggleFavorite:k,Names:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,sampleXaml:P,SimpleXaml:F,IconXaml:I,computed:c,inject:o,provide:e,shallowReactive:r,Button:g,ControlExample:S,DropDownButton:_,FontIcon:s,MenuFlyout:b,get MenuFlyoutItem(){return y},Page:n,ScrollViewer:h,StackPanel:v,TextBlock:d,ToggleButton:x,get useI18n(){return u},get xamlNameScopeKey(){return m},get xamlScopeKey(){return l},get createPageState(){return C},get simpleDefinition(){return w},get iconDefinition(){return T},get DropDownCSharp(){return E}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}};function O(e,n,r,a,o,s){return t(),p(a.Page,null,{default:i(()=>[f(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[f(a.StackPanel,{class:`gallery-item-page`},{default:i(()=>[f(a.StackPanel,{class:`page-heading`},{default:i(()=>[f(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),f(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:i(()=>[f(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:i(()=>[f(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),f(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:i(()=>[f(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),f(a.StackPanel,{class:`gallery-page-content`},{default:i(()=>[f(a.ControlExample,{SampleDefinition:`DropDownButton\\DropDownButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:i(()=>[f(a.ControlExample.Example,null,{default:i(()=>[f(a.StackPanel,{"x:Name":`Control1`,Orientation:`Horizontal`},{default:i(()=>[f(a.DropDownButton,{Content:`{x:Bind Labels.Email, Mode=OneWay}`},{default:i(()=>[f(a.DropDownButton.Flyout,null,{default:i(()=>[f(a.MenuFlyout,{Placement:`BottomEdgeAlignedLeft`},{default:i(()=>[f(a.MenuFlyoutItem,{Text:`{x:Bind Labels.Send, Mode=OneWay}`}),f(a.MenuFlyoutItem,{Text:`{x:Bind Labels.Reply, Mode=OneWay}`}),f(a.MenuFlyoutItem,{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),f(a.ControlExample.Output),f(a.ControlExample.Options)]),_:1}),f(a.ControlExample,{SampleDefinition:`DropDownButton\\DropDownButtonIcon.txt`,HeaderText:`{x:Bind Labels.IconHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:i(()=>[f(a.ControlExample.Example,null,{default:i(()=>[f(a.StackPanel,{"x:Name":`Control2`,Orientation:`Horizontal`},{default:i(()=>[f(a.DropDownButton,{"AutomationProperties.Name":`{x:Bind Labels.Email, Mode=OneWay}`},{default:i(()=>[f(a.DropDownButton.Content,null,{default:i(()=>[f(a.FontIcon,{Glyph:``})]),_:1}),f(a.DropDownButton.Flyout,null,{default:i(()=>[f(a.MenuFlyout,{Placement:`BottomEdgeAlignedLeft`},{default:i(()=>[f(a.MenuFlyoutItem,{Text:`{x:Bind Labels.Send, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem.Icon,null,{default:i(()=>[f(a.FontIcon,{Glyph:``})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{Text:`{x:Bind Labels.Reply, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem.Icon,null,{default:i(()=>[f(a.FontIcon,{Glyph:``})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem.Icon,null,{default:i(()=>[f(a.FontIcon,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),f(a.ControlExample.Output),f(a.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=a(D,[[`render`,O],[`__scopeId`,`data-v-01dcef31`],[`__file`,`DropDownButtonPage.vue`]]);export{k as default};