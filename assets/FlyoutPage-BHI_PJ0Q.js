import{Fi as e,I as t,Ti as n,Wi as r,Wt as i,ai as a,di as o,et as s,hi as c,ii as l,o as u,or as d,ri as f,t as p,wi as m}from"./ScrollViewer-PoO_ma9Z.js";import{t as h}from"./Button-DjU0urmJ.js";import{t as g}from"./Flyout-DRW8XITi.js";import{t as _}from"./StackPanel-CT7pl8zy.js";import{t as v}from"./ToggleButton-DwmhXZge.js";import{t as y}from"./ControlExample-C1ahTZEr.js";import{t as b}from"./pageState-BN3kXI7L.js";var x=`--- header
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
`,C={__name:`FlyoutPage`,setup(e,{expose:i}){i();let{t:a}=s(),o=f(()=>({Title:a(`text.flyout`),Description:a(`text.a-flyout-displays-lightweight-ui-that-is-either`),ExampleHeader:a(`text.a-button-with-a-flyout`),EmptyCart:a(`sample.flyout.empty-cart`),RemoveAll:a(`sample.flyout.remove-all`),ConfirmEmpty:a(`sample.flyout.confirm-empty`),SharedFlyout:a(`sample.flyout.shared`),ChangeTheme:a(`sample.navigationview.change-theme`)})),l=r({});n(d,l);let m=c(`currentPage`),C=f(()=>m?.value||`flyout`),{isFavoriteState:w,pageTheme:T,toggleTheme:E,toggleFavorite:D}=b(C.value),O={t:a,Strings:o,controls:l,currentPage:m,pageKey:C,isFavoriteState:w,pageTheme:T,toggleTheme:E,toggleFavorite:D,favoriteGlyph:f(()=>w.value?``:``),FavoriteLabel:f(()=>a(w.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),DeleteConfirmation_Click:()=>{l.Control1?.Flyout?.Hide()},buttonFlyoutCode:x.split(`--- xaml`)[1].trim(),buttonFlyoutCSharp:S,computed:f,inject:c,provide:n,shallowReactive:r,Button:h,ControlExample:y,Flyout:g,Page:t,ScrollViewer:p,StackPanel:_,TextBlock:u,ToggleButton:v,get createPageState(){return b},get useI18n(){return s},get xamlNameScopeKey(){return d},get buttonFlyoutSample(){return x},get buttonFlyoutCSharpSample(){return S}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}},w={class:`gallery-item-page`},T={class:`page-heading`},E={class:`page-header-actions`};function D(t,n,r,i,s,c){return m(),a(i.Page,null,{default:e(()=>[o(i.Page.Resources,null,{default:e(()=>[o(i.Flyout,{"x:Key":`SharedFlyout`},{default:e(()=>[o(i.StackPanel,null,{default:e(()=>[o(i.TextBlock,{Text:`{x:Bind Strings.SharedFlyout, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),o(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(`div`,w,[l(`div`,T,[o(i.TextBlock,{class:`page-header`,Text:`{x:Bind Strings.Title, Mode=OneWay}`}),o(i.TextBlock,{class:`page-description`,Text:`{x:Bind Strings.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(`div`,E,[o(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Strings.ChangeTheme, Mode=OneWay}`},{default:e(()=>[o(i.TextBlock,{class:`icon`,Text:``})]),_:1}),o(i.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,class:`header-action`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,Click:`toggleFavorite`},{default:e(()=>[o(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})])]),o(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[o(i.ControlExample,{HeaderText:`{x:Bind Strings.ExampleHeader, Mode=OneWay}`,SampleDefinition:`Flyout\\ButtonFlyout.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonFlyoutCode, Mode=OneWay}`,CSharp:`{x:Bind buttonFlyoutCSharp, Mode=OneWay}`},{default:e(()=>[o(i.ControlExample.Example,null,{default:e(()=>[o(i.Button,{"x:Name":`Control1`,Content:`{x:Bind Strings.EmptyCart, Mode=OneWay}`},{default:e(()=>[o(i.Button.Flyout,null,{default:e(()=>[o(i.Flyout,null,{default:e(()=>[o(i.StackPanel,null,{default:e(()=>[o(i.TextBlock,{Margin:`0,0,0,12`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Strings.RemoveAll, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),o(i.Button,{Click:`DeleteConfirmation_Click`,Content:`{x:Bind Strings.ConfirmEmpty, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),o(i.ControlExample.Output),o(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var O=i(C,[[`render`,D],[`__scopeId`,`data-v-5f52e00c`],[`__file`,`FlyoutPage.vue`]]);export{O as default};