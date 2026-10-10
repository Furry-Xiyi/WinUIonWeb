import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-B43ymvAj.js";import{t as v}from"./Button-B49t7g4C.js";import{t as y}from"./HyperlinkButton-qCFKPDB4.js";import{t as b}from"./StackPanel-Dy6dKYi5.js";import{t as x}from"./ToggleButton-DDZy2gVz.js";import{t as S}from"./ControlExample-Ddvmn5_c.js";import{t as C}from"./CheckBox-fVMk0wr2.js";import{t as w}from"./pageState-BQHW0me4.js";var T=`--- header
A hyperlink button that navigates to a URI.
--- xaml
<HyperlinkButton Content="Microsoft home page" NavigateUri="https://www.microsoft.com" $(IsEnabled)/>`,E=`--- header
A hyperlink button that handles a Click event.
--- xaml
<HyperlinkButton Content="ToggleButton" Click="HyperlinkButton_Click"/>`,D=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using WinUIGallery.Pages;

namespace WinUIGallery.ControlPages;

public sealed partial class HyperlinkButtonPage : Page
{
    public HyperlinkButtonPage()
    {
        this.InitializeComponent();
    }

    private void GoToHyperlinkButton_Click(object sender, RoutedEventArgs e)
    {
        App.MainWindow.Navigate(typeof(ItemPage), "ToggleButton");
    }
}`,O={class:`gallery-item-page`},k={class:`page-heading`},A={class:`page-header-actions`},j=r({__name:`HyperlinkButtonPage`,setup(r){let{t:j}=h(),M=s(`currentPage`),N=s(`navigate`,()=>{}),{isFavoriteState:P,pageTheme:F,toggleTheme:I,toggleFavorite:L}=w(M?.value||`hyperlinkbutton`);e(l,a({}));let R=c(()=>({PageTitle:j(`text.hyperlinkbutton`),Description:j(`text.a-button-that-appears-as-a-hyperlink`),ToggleTheme:j(`gallery.page-header.toggle-theme`),NavigateHeader:j(`sample.hyperlink.navigate`),ClickHeader:j(`sample.hyperlink.click`),MicrosoftHome:j(`text.microsoft-home-page`),DisableHyperlinkButton:j(`sample.disable-hyperlink-button`),GoToToggleButton:j(`sample.hyperlink.go-to-togglebutton`)})),z=c(()=>j(P.value?`gallery.remove-favorite`:`gallery.add-favorite`)),B=c(()=>P.value?``:``),V=n(!1),H=(e,t)=>N(`togglebutton`),U=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``;return e(u,{Labels:R,FavoriteLabel:z,FavoriteGlyph:B,isFavoriteState:P,pageTheme:F,toggleTheme:I,toggleFavorite:L,IsHyperlinkDisabled:V,GoToHyperlinkButton_Click:H,NavigateXaml:c(()=>U(T).replace(`$(IsEnabled)`,V.value?`IsEnabled="False" `:``)),ClickXaml:U(E),HyperlinkCSharp:D}),(e,n)=>{let r=i(`ControlExampleSubstitution`);return f(),_(g,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,O,[p(`div`,k,[d(m,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(m,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,A,[d(v,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:``,FontSize:`16`})]),_:1}),d(x,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(b,{class:`gallery-page-content`},{default:t(()=>[d(S,{"x:Name":`Example1`,SampleDefinition:`HyperlinkButton\\HyperlinkButtonNavigate.txt`,HeaderText:`{x:Bind Labels.NavigateHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind NavigateXaml, Mode=OneWay}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(y,{"x:Name":`Control1`,Content:`{x:Bind Labels.MicrosoftHome, Mode=OneWay}`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}`,NavigateUri:`https://www.microsoft.com`})]),_:1}),d(S.Output),d(S.Options,null,{default:t(()=>[d(b,null,{default:t(()=>[d(C,{"x:Name":`DisableControl1`,Content:`{x:Bind Labels.DisableHyperlinkButton, Mode=OneWay}`,IsChecked:`{x:Bind IsHyperlinkDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),d(S.Substitutions,null,{default:t(()=>[d(r,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1}),d(S,{SampleDefinition:`HyperlinkButton\\HyperlinkButtonClick.txt`,HeaderText:`{x:Bind Labels.ClickHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ClickXaml}`,CSharp:`{x:Bind HyperlinkCSharp}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(y,{"x:Name":`Control2`,Click:`GoToHyperlinkButton_Click`,Content:`{x:Bind Labels.GoToToggleButton, Mode=OneWay}`})]),_:1}),d(S.Output),d(S.Options)]),_:1})]),_:1})])]),_:1})}}},[[`__scopeId`,`data-v-6fc7837c`]]);export{j as default};