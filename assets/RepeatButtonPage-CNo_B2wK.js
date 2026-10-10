import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-CHNE18MA.js";import{t as v}from"./Button-DO0TiUOq.js";import{t as y}from"./StackPanel-C60XOD66.js";import{t as b}from"./ToggleButton-ZsjZg8Nu.js";import{t as x}from"./RepeatButton-BNAlblBW.js";import{t as S}from"./ControlExample-BKyw2NwY.js";import{t as C}from"./CheckBox-CNlZofm9.js";import{t as w}from"./pageState-Djrh7EdY.js";var T=`--- header
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
`,D=0,O=Object.assign({},{__name:`RepeatButtonPage`,setup(t,{expose:r}){r();let{t:i}=h(),d=s(`currentPage`),{isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:O}=w(d?.value||`repeatbutton`),k=a({});e(l,k);let A=c(()=>({PageTitle:i(`text.repeatbutton`),Description:i(`text.a-button-that-raises-its-click-event-repeatedly-ecf7f2`),ToggleTheme:i(`gallery.page-header.toggle-theme`),SimpleHeader:i(`sample.repeat.simple`),ClickAndHold:i(`text.click-and-hold`),ControlOutput:i(`sample.button.control-output`),DisableRepeatButton:i(`sample.disable-repeatbutton`)})),j=c(()=>i(f.value?`gallery.remove-favorite`:`gallery.add-favorite`)),M=c(()=>f.value?``:``),N=n(!1),P=n(0),F=c(()=>P.value?i(`sample.number-of-clicks`,{count:P.value}):``),I=(e,t)=>{P.value=++D},L=c(()=>(`--- header
A simple RepeatButton with text content.
--- xaml
<RepeatButton Content="Click and hold" Click="RepeatButton_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,N.value?`IsEnabled="False" `:``));e(u,{Labels:A,FavoriteLabel:j,FavoriteGlyph:M,isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:O,IsRepeatDisabled:N,Output:F,RepeatButton_Click:I,RepeatXaml:L,RepeatCSharp:E});let R={get repeatClickCount(){return D},set repeatClickCount(e){D=e},t:i,currentPage:d,isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:O,Names:k,Labels:A,FavoriteLabel:j,FavoriteGlyph:M,IsRepeatDisabled:N,clicks:P,Output:F,RepeatButton_Click:I,RepeatXaml:L,computed:c,inject:s,provide:e,ref:n,shallowReactive:a,Button:v,CheckBox:C,ControlExample:S,FontIcon:o,RepeatButton:x,ScrollViewer:g,StackPanel:y,TextBlock:m,ToggleButton:b,get useI18n(){return h},get xamlNameScopeKey(){return l},get xamlScopeKey(){return u},get createPageState(){return w},get repeatDefinition(){return T},get RepeatCSharp(){return E}};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}}),k={class:`gallery-item-page`},A={class:`page-heading`},j={class:`page-header-actions`};function M(e,n,r,a,o,s){let c=i(`ControlExampleSubstitution`);return f(),_(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,k,[p(`div`,A,[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,j,[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(a.StackPanel,{class:`gallery-page-content`},{default:t(()=>[d(a.ControlExample,{SampleDefinition:`RepeatButton\\RepeatButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RepeatXaml, Mode=OneWay}`,CSharp:`{x:Bind RepeatCSharp}`},{default:t(()=>[d(a.ControlExample.Example,null,{default:t(()=>[d(a.StackPanel,{class:`repeat-example`,Orientation:`Horizontal`},{default:t(()=>[d(a.RepeatButton,{"x:Name":`Control1`,Click:`RepeatButton_Click`,Content:`{x:Bind Labels.ClickAndHold, Mode=OneWay}`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}`}),d(a.TextBlock,{"x:Name":`Control1Output`,Margin:`8,0,0,0`,VerticalAlignment:`Center`,"AutomationProperties.LiveSetting":`Polite`,"AutomationProperties.Name":`{x:Bind Labels.ControlOutput, Mode=OneWay}`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),d(a.ControlExample.Output),d(a.ControlExample.Options,null,{default:t(()=>[d(a.CheckBox,{"x:Name":`DisableControl1`,Content:`{x:Bind Labels.DisableRepeatButton, Mode=OneWay}`,IsChecked:`{x:Bind IsRepeatDisabled, Mode=TwoWay}`})]),_:1}),d(a.ControlExample.Substitutions,null,{default:t(()=>[d(c,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}var N=r(O,[[`render`,M],[`__scopeId`,`data-v-940cf3de`],[`__file`,`RepeatButtonPage.vue`]]);export{N as default};