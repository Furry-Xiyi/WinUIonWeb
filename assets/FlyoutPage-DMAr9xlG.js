import{Di as e,Ei as t,I as n,Ki as r,Li as i,Wt as a,_i as o,ai as s,et as c,o as l,oi as u,pi as d,si as f,sr as p,t as m}from"./ScrollViewer-BWDA_C78.js";import{t as h}from"./Button-BNDPNdYJ.js";import{t as g}from"./Flyout-C3sOZyEQ.js";import{t as _}from"./StackPanel-sg_Bd5oB.js";import{t as v}from"./ToggleButton-HP5wmrvH.js";import{t as y}from"./ControlExample-CzGyf8u0.js";import{t as b}from"./pageState-CcJibQcm.js";var x=`--- header
A button with a flyout
--- xaml
<Button Content="Empty cart">
    <Button.Flyout>
        <Flyout>
            <StackPanel>
                <TextBlock Style="{ThemeResource BaseTextBlockStyle}" Text="All items will be removed. Do you want to continue?" Margin="0,0,0,12" />
                <Button Click="DeleteConfirmation_Click" Content="Yes, empty my cart" />
            </StackPanel>
        </Flyout>
    </Button.Flyout>
</Button>`,S=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class FlyoutPage : Page
{
    public FlyoutPage()
    {
        this.InitializeComponent();
    }

    private void DeleteConfirmation_Click(object sender, RoutedEventArgs e)
    {
        if (this.Control1.Flyout is Flyout f)
        {
            f.Hide();
        }
    }
}
`,C={__name:`FlyoutPage`,setup(t,{expose:i}){i();let{t:a}=c(),u=s(()=>({Title:a(`text.flyout`),Description:a(`text.a-flyout-displays-lightweight-ui-that-is-either`),ExampleHeader:a(`text.a-button-with-a-flyout`),EmptyCart:a(`sample.flyout.empty-cart`),RemoveAll:a(`sample.flyout.remove-all`),ConfirmEmpty:a(`sample.flyout.confirm-empty`),SharedFlyout:a(`sample.flyout.shared`),ChangeTheme:a(`sample.navigationview.change-theme`)})),d=r({});e(p,d);let f=o(`currentPage`),C=s(()=>f?.value||`flyout`),{isFavoriteState:w,pageTheme:T,toggleTheme:E,toggleFavorite:D}=b(C.value),O={t:a,Strings:u,controls:d,currentPage:f,pageKey:C,isFavoriteState:w,pageTheme:T,toggleTheme:E,toggleFavorite:D,favoriteGlyph:s(()=>w.value?``:``),FavoriteLabel:s(()=>a(w.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),DeleteConfirmation_Click:()=>{d.Control1?.Flyout?.Hide()},buttonFlyoutCode:x.split(`--- xaml`)[1].trim(),buttonFlyoutCSharp:S,computed:s,inject:o,provide:e,shallowReactive:r,Button:h,ControlExample:y,Flyout:g,Page:n,ScrollViewer:m,StackPanel:_,TextBlock:l,ToggleButton:v,get createPageState(){return b},get useI18n(){return c},get xamlNameScopeKey(){return p},get buttonFlyoutSample(){return x},get buttonFlyoutCSharpSample(){return S}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}},w={class:`gallery-item-page`},T={class:`page-heading`},E={class:`page-header-actions`};function D(e,n,r,a,o,s){return t(),f(a.Page,null,{default:i(()=>[d(a.Page.Resources,null,{default:i(()=>[d(a.Flyout,{"x:Key":`SharedFlyout`},{default:i(()=>[d(a.StackPanel,null,{default:i(()=>[d(a.TextBlock,{Text:`{x:Bind Strings.SharedFlyout, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),d(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[u(`div`,w,[u(`div`,T,[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind Strings.Title, Mode=OneWay}`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind Strings.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(`div`,E,[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Strings.ChangeTheme, Mode=OneWay}`},{default:i(()=>[d(a.TextBlock,{class:`icon`,Text:``})]),_:1}),d(a.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,class:`header-action`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,Click:`toggleFavorite`},{default:i(()=>[d(a.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})])]),d(a.StackPanel,{class:`gallery-page-content`},{default:i(()=>[d(a.ControlExample,{HeaderText:`{x:Bind Strings.ExampleHeader, Mode=OneWay}`,SampleDefinition:`Flyout\\ButtonFlyout.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonFlyoutCode, Mode=OneWay}`,CSharp:`{x:Bind buttonFlyoutCSharp, Mode=OneWay}`},{default:i(()=>[d(a.ControlExample.Example,null,{default:i(()=>[d(a.Button,{"x:Name":`Control1`,Content:`{x:Bind Strings.EmptyCart, Mode=OneWay}`},{default:i(()=>[d(a.Button.Flyout,null,{default:i(()=>[d(a.Flyout,null,{default:i(()=>[d(a.StackPanel,null,{default:i(()=>[d(a.TextBlock,{Margin:`0,0,0,12`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Strings.RemoveAll, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(a.Button,{Click:`DeleteConfirmation_Click`,Content:`{x:Bind Strings.ConfirmEmpty, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output),d(a.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var O=a(C,[[`render`,D],[`__scopeId`,`data-v-5f52e00c`],[`__file`,`FlyoutPage.vue`]]);export{O as default};