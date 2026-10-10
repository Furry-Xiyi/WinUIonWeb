import{Ai as e,Bi as t,Cn as n,Mn as r,Yi as i,bi as a,ci as o,dr as s,gi as c,ki as l,li as u,o as d,p as f,t as p,ui as m}from"./ScrollViewer-CHNE18MA.js";import{t as h}from"./Button-DO0TiUOq.js";import{t as g}from"./Flyout-8D4iwnYI.js";import{t as _}from"./StackPanel-C60XOD66.js";import{t as v}from"./ToggleButton-ZsjZg8Nu.js";import{t as y}from"./ControlExample-BKyw2NwY.js";import{t as b}from"./pageState-Djrh7EdY.js";var x=`--- header
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
`,C={__name:`FlyoutPage`,setup(t,{expose:r}){r();let{t:c}=f(),l=o(()=>({Title:c(`text.flyout`),Description:c(`text.a-flyout-displays-lightweight-ui-that-is-either`),ExampleHeader:c(`text.a-button-with-a-flyout`),EmptyCart:c(`sample.flyout.empty-cart`),RemoveAll:c(`sample.flyout.remove-all`),ConfirmEmpty:c(`sample.flyout.confirm-empty`),SharedFlyout:c(`sample.flyout.shared`),ChangeTheme:c(`sample.navigationview.change-theme`)})),u=i({});e(s,u);let m=a(`currentPage`),C=o(()=>m?.value||`flyout`),{isFavoriteState:w,pageTheme:T,toggleTheme:E,toggleFavorite:D}=b(C.value),O={t:c,Strings:l,controls:u,currentPage:m,pageKey:C,isFavoriteState:w,pageTheme:T,toggleTheme:E,toggleFavorite:D,favoriteGlyph:o(()=>w.value?``:``),FavoriteLabel:o(()=>c(w.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),DeleteConfirmation_Click:()=>{u.Control1?.Flyout?.Hide()},buttonFlyoutCode:x.split(`--- xaml`)[1].trim(),buttonFlyoutCSharp:S,computed:o,inject:a,provide:e,shallowReactive:i,Button:h,ControlExample:y,Flyout:g,Page:n,ScrollViewer:p,StackPanel:_,TextBlock:d,ToggleButton:v,get createPageState(){return b},get useI18n(){return f},get xamlNameScopeKey(){return s},get buttonFlyoutSample(){return x},get buttonFlyoutCSharpSample(){return S}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}},w={class:`gallery-item-page`},T={class:`page-heading`},E={class:`page-header-actions`};function D(e,n,r,i,a,o){return l(),m(i.Page,null,{default:t(()=>[c(i.Page.Resources,null,{default:t(()=>[c(i.Flyout,{"x:Key":`SharedFlyout`},{default:t(()=>[c(i.StackPanel,null,{default:t(()=>[c(i.TextBlock,{Text:`{x:Bind Strings.SharedFlyout, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(`div`,w,[u(`div`,T,[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind Strings.Title, Mode=OneWay}`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind Strings.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(`div`,E,[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Strings.ChangeTheme, Mode=OneWay}`},{default:t(()=>[c(i.TextBlock,{class:`icon`,Text:``})]),_:1}),c(i.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,class:`header-action`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,Click:`toggleFavorite`},{default:t(()=>[c(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})])]),c(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[c(i.ControlExample,{HeaderText:`{x:Bind Strings.ExampleHeader, Mode=OneWay}`,SampleDefinition:`Flyout\\ButtonFlyout.txt`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonFlyoutCode, Mode=OneWay}`,CSharp:`{x:Bind buttonFlyoutCSharp, Mode=OneWay}`},{default:t(()=>[c(i.ControlExample.Example,null,{default:t(()=>[c(i.Button,{"x:Name":`Control1`,Content:`{x:Bind Strings.EmptyCart, Mode=OneWay}`},{default:t(()=>[c(i.Button.Flyout,null,{default:t(()=>[c(i.Flyout,null,{default:t(()=>[c(i.StackPanel,null,{default:t(()=>[c(i.TextBlock,{Margin:`0,0,0,12`,Style:`{ThemeResource BaseTextBlockStyle}`,Text:`{x:Bind Strings.RemoveAll, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.Button,{Click:`DeleteConfirmation_Click`,Content:`{x:Bind Strings.ConfirmEmpty, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var O=r(C,[[`render`,D],[`__scopeId`,`data-v-5f52e00c`],[`__file`,`FlyoutPage.vue`]]);export{O as default};