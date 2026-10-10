import{Fi as e,Oi as t,Ti as n,Ui as r,Wi as i,Wt as a,a as o,ai as s,di as c,et as l,hi as u,ii as d,o as f,or as p,ri as m,sr as h,t as g,wi as _}from"./ScrollViewer-PoO_ma9Z.js";import{t as v}from"./Button-DjU0urmJ.js";import{t as y}from"./CheckBox-Cq84xW8n.js";import{t as b}from"./RepeatButton-Cb4lzgU9.js";import{t as x}from"./StackPanel-CT7pl8zy.js";import{t as S}from"./ToggleButton-DwmhXZge.js";import{t as C}from"./ControlExample-C1ahTZEr.js";import{t as w}from"./pageState-BN3kXI7L.js";var T=`--- header
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
`,D=0,O=Object.assign({},{__name:`RepeatButtonPage`,setup(e,{expose:t}){t();let{t:a}=l(),s=u(`currentPage`),{isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:O}=w(s?.value||`repeatbutton`),k=i({});n(p,k);let A=m(()=>({PageTitle:a(`text.repeatbutton`),Description:a(`text.a-button-that-raises-its-click-event-repeatedly-ecf7f2`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`sample.repeat.simple`),ClickAndHold:a(`text.click-and-hold`),ControlOutput:a(`sample.button.control-output`),DisableRepeatButton:a(`sample.disable-repeatbutton`)})),j=m(()=>a(c.value?`gallery.remove-favorite`:`gallery.add-favorite`)),M=m(()=>c.value?``:``),N=r(!1),P=r(0),F=m(()=>P.value?a(`sample.number-of-clicks`,{count:P.value}):``),I=(e,t)=>{P.value=++D},L=m(()=>(`--- header
A simple RepeatButton with text content.
--- xaml
<RepeatButton Content="Click and hold" Click="RepeatButton_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,N.value?`IsEnabled="False" `:``));n(h,{Labels:A,FavoriteLabel:j,FavoriteGlyph:M,isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:O,IsRepeatDisabled:N,Output:F,RepeatButton_Click:I,RepeatXaml:L,RepeatCSharp:E});let R={get repeatClickCount(){return D},set repeatClickCount(e){D=e},t:a,currentPage:s,isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:O,Names:k,Labels:A,FavoriteLabel:j,FavoriteGlyph:M,IsRepeatDisabled:N,clicks:P,Output:F,RepeatButton_Click:I,RepeatXaml:L,computed:m,inject:u,provide:n,ref:r,shallowReactive:i,Button:v,CheckBox:y,ControlExample:C,FontIcon:o,RepeatButton:b,ScrollViewer:g,StackPanel:x,TextBlock:f,ToggleButton:S,get useI18n(){return l},get xamlNameScopeKey(){return p},get xamlScopeKey(){return h},get createPageState(){return w},get repeatDefinition(){return T},get RepeatCSharp(){return E}};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}}),k={class:`gallery-item-page`},A={class:`page-heading`},j={class:`page-header-actions`};function M(n,r,i,a,o,l){let u=t(`ControlExampleSubstitution`);return _(),s(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[d(`div`,k,[d(`div`,A,[c(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),c(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(`div`,j,[c(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[c(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),c(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[c(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),c(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(a.ControlExample,{SampleDefinition:`RepeatButton\\RepeatButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RepeatXaml, Mode=OneWay}`,CSharp:`{x:Bind RepeatCSharp}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.StackPanel,{class:`repeat-example`,Orientation:`Horizontal`},{default:e(()=>[c(a.RepeatButton,{"x:Name":`Control1`,Click:`RepeatButton_Click`,Content:`{x:Bind Labels.ClickAndHold, Mode=OneWay}`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}`}),c(a.TextBlock,{"x:Name":`Control1Output`,Margin:`8,0,0,0`,VerticalAlignment:`Center`,"AutomationProperties.LiveSetting":`Polite`,"AutomationProperties.Name":`{x:Bind Labels.ControlOutput, Mode=OneWay}`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options,null,{default:e(()=>[c(a.CheckBox,{"x:Name":`DisableControl1`,Content:`{x:Bind Labels.DisableRepeatButton, Mode=OneWay}`,IsChecked:`{x:Bind IsRepeatDisabled, Mode=TwoWay}`})]),_:1}),c(a.ControlExample.Substitutions,null,{default:e(()=>[c(u,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}var N=a(O,[[`render`,M],[`__scopeId`,`data-v-940cf3de`],[`__file`,`RepeatButtonPage.vue`]]);export{N as default};