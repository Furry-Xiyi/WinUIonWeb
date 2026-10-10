import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-DXAtwYnH.js";import{t as v}from"./Button-1Ztf3pH0.js";import{t as y}from"./StackPanel-DGz4UnE4.js";import{t as b}from"./ToggleButton-D0RGNdIP.js";import{t as x}from"./RepeatButton-Dg5n_Xao.js";import{t as S}from"./ControlExample-BX-yRpiQ.js";import{t as C}from"./CheckBox-B-MclrZ_.js";import{t as w}from"./pageState-cPponcIo.js";var T=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,E={class:`gallery-item-page`},D={class:`page-heading`},O={class:`page-header-actions`},k=0,A=r(Object.assign({},{__name:`RepeatButtonPage`,setup(r){let{t:A}=h(),{isFavoriteState:j,pageTheme:M,toggleTheme:N,toggleFavorite:P}=w(s(`currentPage`)?.value||`repeatbutton`);e(l,a({}));let F=c(()=>({PageTitle:A(`text.repeatbutton`),Description:A(`text.a-button-that-raises-its-click-event-repeatedly-ecf7f2`),ToggleTheme:A(`gallery.page-header.toggle-theme`),SimpleHeader:A(`sample.repeat.simple`),ClickAndHold:A(`text.click-and-hold`),ControlOutput:A(`sample.button.control-output`),DisableRepeatButton:A(`sample.disable-repeatbutton`)})),I=c(()=>A(j.value?`gallery.remove-favorite`:`gallery.add-favorite`)),L=c(()=>j.value?``:``),R=n(!1),z=n(0);return e(u,{Labels:F,FavoriteLabel:I,FavoriteGlyph:L,isFavoriteState:j,pageTheme:M,toggleTheme:N,toggleFavorite:P,IsRepeatDisabled:R,Output:c(()=>z.value?A(`sample.number-of-clicks`,{count:z.value}):``),RepeatButton_Click:(e,t)=>{z.value=++k},RepeatXaml:c(()=>(`--- header
A simple RepeatButton with text content.
--- xaml
<RepeatButton Content="Click and hold" Click="RepeatButton_Click" $(IsEnabled)/>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`$(IsEnabled)`,R.value?`IsEnabled="False" `:``)),RepeatCSharp:T}),(e,n)=>{let r=i(`ControlExampleSubstitution`);return f(),_(g,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,E,[p(`div`,D,[d(m,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(m,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,O,[d(v,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:``,FontSize:`16`})]),_:1}),d(b,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(y,{class:`gallery-page-content`},{default:t(()=>[d(S,{SampleDefinition:`RepeatButton\\RepeatButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RepeatXaml, Mode=OneWay}`,CSharp:`{x:Bind RepeatCSharp}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(y,{class:`repeat-example`,Orientation:`Horizontal`},{default:t(()=>[d(x,{"x:Name":`Control1`,Click:`RepeatButton_Click`,Content:`{x:Bind Labels.ClickAndHold, Mode=OneWay}`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}`}),d(m,{"x:Name":`Control1Output`,Margin:`8,0,0,0`,VerticalAlignment:`Center`,"AutomationProperties.LiveSetting":`Polite`,"AutomationProperties.Name":`{x:Bind Labels.ControlOutput, Mode=OneWay}`,Text:`{x:Bind Output, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),d(S.Output),d(S.Options,null,{default:t(()=>[d(C,{"x:Name":`DisableControl1`,Content:`{x:Bind Labels.DisableRepeatButton, Mode=OneWay}`,IsChecked:`{x:Bind IsRepeatDisabled, Mode=TwoWay}`})]),_:1}),d(S.Substitutions,null,{default:t(()=>[d(r,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableControl1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1})]),_:1})])]),_:1})}}}),[[`__scopeId`,`data-v-940cf3de`]]);export{A as default};