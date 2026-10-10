import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-B43ymvAj.js";import{t as v}from"./Button-B49t7g4C.js";import{t as y}from"./StackPanel-Dy6dKYi5.js";import{t as b}from"./ToggleButton-DDZy2gVz.js";import{t as x}from"./ControlExample-Ddvmn5_c.js";import{t as S}from"./CheckBox-fVMk0wr2.js";import{t as C}from"./pageState-BQHW0me4.js";var w=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ToggleButtonPage : Page
{
    public ToggleButtonPage()
    {
        this.InitializeComponent();

        // Set initial output value.
        Control1Output.Text = Toggle1.IsChecked is true ? "On" : "Off";
    }

    private void ToggleButton_Checked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = "On";
    }

    private void ToggleButton_Unchecked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = "Off";
    }
}
`,T={class:`gallery-item-page`},E={class:`page-heading`},D={class:`page-header-actions`},O=r({__name:`ToggleButtonPage`,setup(r){let{t:O}=h(),{isFavoriteState:k,pageTheme:A,toggleTheme:j,toggleFavorite:M}=C(s(`currentPage`)?.value||`togglebutton`);e(l,a({}));let N=c(()=>({PageTitle:O(`text.togglebutton`),Description:O(`text.a-togglebutton-looks-like-a-button-but-works-lik`),ToggleTheme:O(`gallery.page-header.toggle-theme`),SimpleHeader:O(`sample.togglebutton.simple`),DisableToggleButton:O(`sample.disable-togglebutton`)})),P=c(()=>O(k.value?`gallery.remove-favorite`:`gallery.add-favorite`)),F=c(()=>k.value?``:``),I=n(!1),L=n(!1);return e(u,{Labels:N,FavoriteLabel:P,FavoriteGlyph:F,isFavoriteState:k,pageTheme:A,toggleTheme:j,toggleFavorite:M,IsToggleDisabled:I,Output:c(()=>O(L.value?`sample.togglebutton.on`:`sample.togglebutton.off`)),ToggleButton_Checked:(e,t)=>{L.value=!0},ToggleButton_Unchecked:(e,t)=>{L.value=!1},ToggleXaml:c(()=>(`--- header
A simple ToggleButton with text content.
--- xaml
<ToggleButton Content="ToggleButton" Click="Button_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,I.value?`IsEnabled="False" `:``)),ToggleCSharp:w}),(e,n)=>{let r=i(`ControlExampleSubstitution`);return f(),_(g,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,T,[p(`div`,E,[d(m,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(m,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,D,[d(v,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:``,FontSize:`16`})]),_:1}),d(b,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(y,{class:`gallery-page-content`},{default:t(()=>[d(x,{SampleDefinition:`ToggleButton\\ToggleButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml, Mode=OneWay}`,CSharp:`{x:Bind ToggleCSharp}`},{default:t(()=>[d(x.Example,null,{default:t(()=>[d(y,{VerticalAlignment:`Top`,Orientation:`Horizontal`},{default:t(()=>[d(b,{"x:Name":`Toggle1`,Checked:`ToggleButton_Checked`,Content:`{x:Bind Labels.PageTitle, Mode=OneWay}`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}`,Unchecked:`ToggleButton_Unchecked`})]),_:1})]),_:1}),d(x.Output,null,{default:t(()=>[d(m,{"x:Name":`Control1Output`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(x.Options,null,{default:t(()=>[d(y,null,{default:t(()=>[d(S,{"x:Name":`DisableToggle1`,Content:`{x:Bind Labels.DisableToggleButton, Mode=OneWay}`,IsChecked:`{x:Bind IsToggleDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),d(x.Substitutions,null,{default:t(()=>[d(r,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}}},[[`__scopeId`,`data-v-b6090350`]]);export{O as default};