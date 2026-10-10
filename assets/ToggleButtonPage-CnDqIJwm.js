import{Fi as e,Oi as t,Ti as n,Ui as r,Wi as i,Wt as a,a as o,ai as s,di as c,et as l,hi as u,ii as d,o as f,or as p,ri as m,sr as h,t as g,wi as _}from"./ScrollViewer-PoO_ma9Z.js";import{t as v}from"./Button-DjU0urmJ.js";import{t as y}from"./CheckBox-Cq84xW8n.js";import{t as b}from"./StackPanel-CT7pl8zy.js";import{t as x}from"./ToggleButton-DwmhXZge.js";import{t as S}from"./ControlExample-C1ahTZEr.js";import{t as C}from"./pageState-BN3kXI7L.js";var w=`--- header
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
`,E={__name:`ToggleButtonPage`,setup(e,{expose:t}){t();let{t:a}=l(),s=u(`currentPage`),{isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:E}=C(s?.value||`togglebutton`),D=i({});n(p,D);let O=m(()=>({PageTitle:a(`text.togglebutton`),Description:a(`text.a-togglebutton-looks-like-a-button-but-works-lik`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`sample.togglebutton.simple`),DisableToggleButton:a(`sample.disable-togglebutton`)})),k=m(()=>a(c.value?`gallery.remove-favorite`:`gallery.add-favorite`)),A=m(()=>c.value?``:``),j=r(!1),M=r(!1),N=m(()=>a(M.value?`sample.togglebutton.on`:`sample.togglebutton.off`)),P=(e,t)=>{M.value=!0},F=(e,t)=>{M.value=!1},I=m(()=>(`--- header
A simple ToggleButton with text content.
--- xaml
<ToggleButton Content="ToggleButton" Click="Button_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,j.value?`IsEnabled="False" `:``));n(h,{Labels:O,FavoriteLabel:k,FavoriteGlyph:A,isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:E,IsToggleDisabled:j,Output:N,ToggleButton_Checked:P,ToggleButton_Unchecked:F,ToggleXaml:I,ToggleCSharp:T});let L={t:a,currentPage:s,isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:E,Names:D,Labels:O,FavoriteLabel:k,FavoriteGlyph:A,IsToggleDisabled:j,IsToggleChecked:M,Output:N,ToggleButton_Checked:P,ToggleButton_Unchecked:F,ToggleXaml:I,computed:m,inject:u,provide:n,ref:r,shallowReactive:i,Button:v,CheckBox:y,ControlExample:S,FontIcon:o,ScrollViewer:g,StackPanel:b,TextBlock:f,ToggleButton:x,get useI18n(){return l},get xamlNameScopeKey(){return p},get xamlScopeKey(){return h},get createPageState(){return C},get toggleDefinition(){return w},get ToggleCSharp(){return T}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(n,r,i,a,o,l){let u=t(`ControlExampleSubstitution`);return _(),s(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[d(`div`,D,[d(`div`,O,[c(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),c(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(`div`,k,[c(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[c(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),c(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[c(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),c(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(a.ControlExample,{SampleDefinition:`ToggleButton\\ToggleButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml, Mode=OneWay}`,CSharp:`{x:Bind ToggleCSharp}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.StackPanel,{VerticalAlignment:`Top`,Orientation:`Horizontal`},{default:e(()=>[c(a.ToggleButton,{"x:Name":`Toggle1`,Checked:`ToggleButton_Checked`,Content:`{x:Bind Labels.PageTitle, Mode=OneWay}`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}`,Unchecked:`ToggleButton_Unchecked`})]),_:1})]),_:1}),c(a.ControlExample.Output,null,{default:e(()=>[c(a.TextBlock,{"x:Name":`Control1Output`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),c(a.ControlExample.Options,null,{default:e(()=>[c(a.StackPanel,null,{default:e(()=>[c(a.CheckBox,{"x:Name":`DisableToggle1`,Content:`{x:Bind Labels.DisableToggleButton, Mode=OneWay}`,IsChecked:`{x:Bind IsToggleDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),c(a.ControlExample.Substitutions,null,{default:e(()=>[c(u,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}var j=a(E,[[`render`,A],[`__scopeId`,`data-v-b6090350`],[`__file`,`ToggleButtonPage.vue`]]);export{j as default};