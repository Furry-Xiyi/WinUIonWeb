import{Fi as e,I as t,Ti as n,Wi as r,Wt as i,a,ai as o,di as s,et as c,hi as l,o as u,or as d,ri as f,sr as p,t as m,wi as h}from"./ScrollViewer-PoO_ma9Z.js";import{t as g}from"./Button-DjU0urmJ.js";import{t as _}from"./DropDownButton-DBgDl0gi.js";import{t as v}from"./StackPanel-CT7pl8zy.js";import{n as y}from"./MenuFlyoutItems-CdFb5Edx.js";import{t as b}from"./MenuFlyout-BmClHGXs.js";import{t as x}from"./ToggleButton-DwmhXZge.js";import{t as S}from"./ControlExample-C1ahTZEr.js";import{t as C}from"./pageState-BN3kXI7L.js";var w=`--- header
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
`,D={__name:`DropDownButtonPage`,setup(e,{expose:i}){i();let{t:o}=c(),s=l(`currentPage`),{isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k}=C(s?.value||`dropdownbutton`),A=r({});n(d,A);let j=f(()=>({PageTitle:o(`text.dropdownbutton`),Description:o(`text.a-dropdownbutton-is-a-button-that-displays-a-che`),ToggleTheme:o(`gallery.page-header.toggle-theme`),SimpleHeader:o(`sample.dropdownbutton.simple`),IconHeader:o(`sample.dropdownbutton.icons`),Email:o(`text.email`),Send:o(`text.send`),Reply:o(`text.reply`),ReplyAll:o(`text.reply-all`)})),M=f(()=>o(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=f(()=>h.value?``:``),P=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,F=P(w),I=P(T);n(p,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k,SimpleXaml:F,IconXaml:I,DropDownCSharp:E});let L={t:o,currentPage:s,isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k,Names:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,sampleXaml:P,SimpleXaml:F,IconXaml:I,computed:f,inject:l,provide:n,shallowReactive:r,Button:g,ControlExample:S,DropDownButton:_,FontIcon:a,MenuFlyout:b,get MenuFlyoutItem(){return y},Page:t,ScrollViewer:m,StackPanel:v,TextBlock:u,ToggleButton:x,get useI18n(){return c},get xamlNameScopeKey(){return d},get xamlScopeKey(){return p},get createPageState(){return C},get simpleDefinition(){return w},get iconDefinition(){return T},get DropDownCSharp(){return E}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}};function O(t,n,r,i,a,c){return h(),o(i.Page,null,{default:e(()=>[s(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[s(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[s(i.StackPanel,{class:`page-heading`},{default:e(()=>[s(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),s(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),s(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[s(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[s(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),s(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[s(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),s(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[s(i.ControlExample,{SampleDefinition:`DropDownButton\\DropDownButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{"x:Name":`Control1`,Orientation:`Horizontal`},{default:e(()=>[s(i.DropDownButton,{Content:`{x:Bind Labels.Email, Mode=OneWay}`},{default:e(()=>[s(i.DropDownButton.Flyout,null,{default:e(()=>[s(i.MenuFlyout,{Placement:`BottomEdgeAlignedLeft`},{default:e(()=>[s(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Send, Mode=OneWay}`}),s(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reply, Mode=OneWay}`}),s(i.MenuFlyoutItem,{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),s(i.ControlExample.Output),s(i.ControlExample.Options)]),_:1}),s(i.ControlExample,{SampleDefinition:`DropDownButton\\DropDownButtonIcon.txt`,HeaderText:`{x:Bind Labels.IconHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconXaml, Mode=OneWay}`,CSharp:`{x:Bind DropDownCSharp}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{"x:Name":`Control2`,Orientation:`Horizontal`},{default:e(()=>[s(i.DropDownButton,{"AutomationProperties.Name":`{x:Bind Labels.Email, Mode=OneWay}`},{default:e(()=>[s(i.DropDownButton.Content,null,{default:e(()=>[s(i.FontIcon,{Glyph:``})]),_:1}),s(i.DropDownButton.Flyout,null,{default:e(()=>[s(i.MenuFlyout,{Placement:`BottomEdgeAlignedLeft`},{default:e(()=>[s(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Send, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem.Icon,null,{default:e(()=>[s(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reply, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem.Icon,null,{default:e(()=>[s(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{Text:`{x:Bind Labels.ReplyAll, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem.Icon,null,{default:e(()=>[s(i.FontIcon,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),s(i.ControlExample.Output),s(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=i(D,[[`render`,O],[`__scopeId`,`data-v-01dcef31`],[`__file`,`DropDownButtonPage.vue`]]);export{k as default};