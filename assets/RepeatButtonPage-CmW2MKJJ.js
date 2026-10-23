import{Ai as e,Di as t,Ei as n,Gi as r,Ki as i,Li as a,Wt as o,_i as s,a as c,ai as l,cr as u,et as d,o as f,oi as p,pi as m,si as h,sr as g,t as _}from"./ScrollViewer-BWDA_C78.js";import{t as v}from"./Button-BNDPNdYJ.js";import{t as y}from"./CheckBox-BArw_ebH.js";import{t as b}from"./RepeatButton-FIOD8UxW.js";import{t as x}from"./StackPanel-sg_Bd5oB.js";import{t as S}from"./ToggleButton-HP5wmrvH.js";import{t as C}from"./ControlExample-CzGyf8u0.js";import{t as w}from"./pageState-CcJibQcm.js";var T=`--- header
A simple RepeatButton with text content.
--- xaml
<RepeatButton Content="Click and hold" Click="RepeatButton_Click" $(IsEnabled)/>`,E=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation.Peers;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class RepeatButtonPage : Page
{
    public RepeatButtonPage()
    {
        this.InitializeComponent();
    }

    private static int _clicks = 0;
    private void RepeatButton_Click(object sender, RoutedEventArgs e)
    {
        _clicks += 1;
        Control1Output.Text = "Number of clicks: " + _clicks;

        AutomationPeer peer = FrameworkElementAutomationPeer.FromElement(Control1Output) ?? FrameworkElementAutomationPeer.CreatePeerForElement(Control1Output);
        peer?.RaiseAutomationEvent(AutomationEvents.LiveRegionChanged);
    }
}
`,D=0,O=Object.assign({},{__name:`RepeatButtonPage`,setup(e,{expose:n}){n();let{t:a}=d(),o=s(`currentPage`),{isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:O}=w(o?.value||`repeatbutton`),k=i({});t(g,k);let A=l(()=>({PageTitle:a(`text.repeatbutton`),Description:a(`text.a-button-that-raises-its-click-event-repeatedly-ecf7f2`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`sample.repeat.simple`),ClickAndHold:a(`text.click-and-hold`),ControlOutput:a(`sample.button.control-output`),DisableRepeatButton:a(`sample.disable-repeatbutton`)})),j=l(()=>a(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),M=l(()=>p.value?``:``),N=r(!1),P=r(0),F=l(()=>P.value?a(`sample.number-of-clicks`,{count:P.value}):``),I=(e,t)=>{P.value=++D},L=l(()=>(`--- header
A simple RepeatButton with text content.
--- xaml
<RepeatButton Content="Click and hold" Click="RepeatButton_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,N.value?`IsEnabled="False" `:``));t(u,{Labels:A,FavoriteLabel:j,FavoriteGlyph:M,isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:O,IsRepeatDisabled:N,Output:F,RepeatButton_Click:I,RepeatXaml:L,RepeatCSharp:E});let R={get repeatClickCount(){return D},set repeatClickCount(e){D=e},t:a,currentPage:o,isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:O,Names:k,Labels:A,FavoriteLabel:j,FavoriteGlyph:M,IsRepeatDisabled:N,clicks:P,Output:F,RepeatButton_Click:I,RepeatXaml:L,computed:l,inject:s,provide:t,ref:r,shallowReactive:i,Button:v,CheckBox:y,ControlExample:C,FontIcon:c,RepeatButton:b,ScrollViewer:_,StackPanel:x,TextBlock:f,ToggleButton:S,get useI18n(){return d},get xamlNameScopeKey(){return g},get xamlScopeKey(){return u},get createPageState(){return w},get repeatDefinition(){return T},get RepeatCSharp(){return E}};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}}),k={class:`gallery-item-page`},A={class:`page-heading`},j={class:`page-header-actions`};function M(t,r,i,o,s,c){let l=e(`ControlExampleSubstitution`);return n(),h(o.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[p(`div`,k,[p(`div`,A,[m(o.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(o.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,j,[m(o.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[m(o.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(o.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[m(o.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),m(o.StackPanel,{class:`gallery-page-content`},{default:a(()=>[m(o.ControlExample,{SampleDefinition:`RepeatButton\\RepeatButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RepeatXaml, Mode=OneWay}`,CSharp:`{x:Bind RepeatCSharp}`},{default:a(()=>[m(o.ControlExample.Example,null,{default:a(()=>[m(o.StackPanel,{class:`repeat-example`,Orientation:`Horizontal`},{default:a(()=>[m(o.RepeatButton,{"x:Name":`Control1`,Click:`RepeatButton_Click`,Content:`{x:Bind Labels.ClickAndHold, Mode=OneWay}`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}`}),m(o.TextBlock,{"x:Name":`Control1Output`,Margin:`8,0,0,0`,VerticalAlignment:`Center`,"AutomationProperties.LiveSetting":`Polite`,"AutomationProperties.Name":`{x:Bind Labels.ControlOutput, Mode=OneWay}`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),m(o.ControlExample.Output),m(o.ControlExample.Options,null,{default:a(()=>[m(o.CheckBox,{"x:Name":`DisableControl1`,Content:`{x:Bind Labels.DisableRepeatButton, Mode=OneWay}`,IsChecked:`{x:Bind IsRepeatDisabled, Mode=TwoWay}`})]),_:1}),m(o.ControlExample.Substitutions,null,{default:a(()=>[m(l,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}var N=o(O,[[`render`,M],[`__scopeId`,`data-v-940cf3de`],[`__file`,`RepeatButtonPage.vue`]]);export{N as default};