import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-CHNE18MA.js";import{t as v}from"./Button-DO0TiUOq.js";import{t as y}from"./StackPanel-C60XOD66.js";import{t as b}from"./ToggleButton-ZsjZg8Nu.js";import{t as x}from"./ControlExample-BKyw2NwY.js";import{t as S}from"./CheckBox-CNlZofm9.js";import{t as C}from"./pageState-Djrh7EdY.js";var w=`--- header
A simple ToggleButton with text content.
--- xaml
<ToggleButton Content="ToggleButton" Click="Button_Click" $(IsEnabled)/>`,T=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,E={__name:`ToggleButtonPage`,setup(t,{expose:r}){r();let{t:i}=h(),d=s(`currentPage`),{isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:E}=C(d?.value||`togglebutton`),D=a({});e(l,D);let O=c(()=>({PageTitle:i(`text.togglebutton`),Description:i(`text.a-togglebutton-looks-like-a-button-but-works-lik`),ToggleTheme:i(`gallery.page-header.toggle-theme`),SimpleHeader:i(`sample.togglebutton.simple`),DisableToggleButton:i(`sample.disable-togglebutton`)})),k=c(()=>i(f.value?`gallery.remove-favorite`:`gallery.add-favorite`)),A=c(()=>f.value?``:``),j=n(!1),M=n(!1),N=c(()=>i(M.value?`sample.togglebutton.on`:`sample.togglebutton.off`)),P=(e,t)=>{M.value=!0},F=(e,t)=>{M.value=!1},I=c(()=>(`--- header
A simple ToggleButton with text content.
--- xaml
<ToggleButton Content="ToggleButton" Click="Button_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,j.value?`IsEnabled="False" `:``));e(u,{Labels:O,FavoriteLabel:k,FavoriteGlyph:A,isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:E,IsToggleDisabled:j,Output:N,ToggleButton_Checked:P,ToggleButton_Unchecked:F,ToggleXaml:I,ToggleCSharp:T});let L={t:i,currentPage:d,isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:E,Names:D,Labels:O,FavoriteLabel:k,FavoriteGlyph:A,IsToggleDisabled:j,IsToggleChecked:M,Output:N,ToggleButton_Checked:P,ToggleButton_Unchecked:F,ToggleXaml:I,computed:c,inject:s,provide:e,ref:n,shallowReactive:a,Button:v,CheckBox:S,ControlExample:x,FontIcon:o,ScrollViewer:g,StackPanel:y,TextBlock:m,ToggleButton:b,get useI18n(){return h},get xamlNameScopeKey(){return l},get xamlScopeKey(){return u},get createPageState(){return C},get toggleDefinition(){return w},get ToggleCSharp(){return T}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(e,n,r,a,o,s){let c=i(`ControlExampleSubstitution`);return f(),_(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,D,[p(`div`,O,[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,k,[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(a.StackPanel,{class:`gallery-page-content`},{default:t(()=>[d(a.ControlExample,{SampleDefinition:`ToggleButton\\ToggleButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml, Mode=OneWay}`,CSharp:`{x:Bind ToggleCSharp}`},{default:t(()=>[d(a.ControlExample.Example,null,{default:t(()=>[d(a.StackPanel,{VerticalAlignment:`Top`,Orientation:`Horizontal`},{default:t(()=>[d(a.ToggleButton,{"x:Name":`Toggle1`,Checked:`ToggleButton_Checked`,Content:`{x:Bind Labels.PageTitle, Mode=OneWay}`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}`,Unchecked:`ToggleButton_Unchecked`})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:t(()=>[d(a.TextBlock,{"x:Name":`Control1Output`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options,null,{default:t(()=>[d(a.StackPanel,null,{default:t(()=>[d(a.CheckBox,{"x:Name":`DisableToggle1`,Content:`{x:Bind Labels.DisableToggleButton, Mode=OneWay}`,IsChecked:`{x:Bind IsToggleDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),d(a.ControlExample.Substitutions,null,{default:t(()=>[d(c,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}var j=r(E,[[`render`,A],[`__scopeId`,`data-v-b6090350`],[`__file`,`ToggleButtonPage.vue`]]);export{j as default};