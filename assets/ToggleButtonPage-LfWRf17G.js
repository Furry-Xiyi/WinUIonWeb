import{Ai as e,Di as t,Ei as n,Gi as r,Ki as i,Li as a,Wt as o,_i as s,a as c,ai as l,cr as u,et as d,o as f,oi as p,pi as m,si as h,sr as g,t as _}from"./ScrollViewer-BWDA_C78.js";import{t as v}from"./Button-BNDPNdYJ.js";import{t as y}from"./CheckBox-BArw_ebH.js";import{t as b}from"./StackPanel-sg_Bd5oB.js";import{t as x}from"./ToggleButton-HP5wmrvH.js";import{t as S}from"./ControlExample-CzGyf8u0.js";import{t as C}from"./pageState-CcJibQcm.js";var w=`--- header
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
`,E={__name:`ToggleButtonPage`,setup(e,{expose:n}){n();let{t:a}=d(),o=s(`currentPage`),{isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:E}=C(o?.value||`togglebutton`),D=i({});t(g,D);let O=l(()=>({PageTitle:a(`text.togglebutton`),Description:a(`text.a-togglebutton-looks-like-a-button-but-works-lik`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`sample.togglebutton.simple`),DisableToggleButton:a(`sample.disable-togglebutton`)})),k=l(()=>a(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),A=l(()=>p.value?``:``),j=r(!1),M=r(!1),N=l(()=>a(M.value?`sample.togglebutton.on`:`sample.togglebutton.off`)),P=(e,t)=>{M.value=!0},F=(e,t)=>{M.value=!1},I=l(()=>(`--- header
A simple ToggleButton with text content.
--- xaml
<ToggleButton Content="ToggleButton" Click="Button_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,j.value?`IsEnabled="False" `:``));t(u,{Labels:O,FavoriteLabel:k,FavoriteGlyph:A,isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:E,IsToggleDisabled:j,Output:N,ToggleButton_Checked:P,ToggleButton_Unchecked:F,ToggleXaml:I,ToggleCSharp:T});let L={t:a,currentPage:o,isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:E,Names:D,Labels:O,FavoriteLabel:k,FavoriteGlyph:A,IsToggleDisabled:j,IsToggleChecked:M,Output:N,ToggleButton_Checked:P,ToggleButton_Unchecked:F,ToggleXaml:I,computed:l,inject:s,provide:t,ref:r,shallowReactive:i,Button:v,CheckBox:y,ControlExample:S,FontIcon:c,ScrollViewer:_,StackPanel:b,TextBlock:f,ToggleButton:x,get useI18n(){return d},get xamlNameScopeKey(){return g},get xamlScopeKey(){return u},get createPageState(){return C},get toggleDefinition(){return w},get ToggleCSharp(){return T}};return Object.defineProperty(L,"__isScriptSetup",{enumerable:!1,value:!0}),L}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(t,r,i,o,s,c){let l=e(`ControlExampleSubstitution`);return n(),h(o.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[p(`div`,D,[p(`div`,O,[m(o.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(o.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,k,[m(o.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[m(o.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(o.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[m(o.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),m(o.StackPanel,{class:`gallery-page-content`},{default:a(()=>[m(o.ControlExample,{SampleDefinition:`ToggleButton\\ToggleButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml, Mode=OneWay}`,CSharp:`{x:Bind ToggleCSharp}`},{default:a(()=>[m(o.ControlExample.Example,null,{default:a(()=>[m(o.StackPanel,{VerticalAlignment:`Top`,Orientation:`Horizontal`},{default:a(()=>[m(o.ToggleButton,{"x:Name":`Toggle1`,Checked:`ToggleButton_Checked`,Content:`{x:Bind Labels.PageTitle, Mode=OneWay}`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}`,Unchecked:`ToggleButton_Unchecked`})]),_:1})]),_:1}),m(o.ControlExample.Output,null,{default:a(()=>[m(o.TextBlock,{"x:Name":`Control1Output`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(o.ControlExample.Options,null,{default:a(()=>[m(o.StackPanel,null,{default:a(()=>[m(o.CheckBox,{"x:Name":`DisableToggle1`,Content:`{x:Bind Labels.DisableToggleButton, Mode=OneWay}`,IsChecked:`{x:Bind IsToggleDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),m(o.ControlExample.Substitutions,null,{default:a(()=>[m(l,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableToggle1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}var j=o(E,[[`render`,A],[`__scopeId`,`data-v-b6090350`],[`__file`,`ToggleButtonPage.vue`]]);export{j as default};