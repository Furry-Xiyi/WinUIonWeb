import{Fi as e,Oi as t,Ti as n,Ui as r,Wi as i,Wt as a,a as o,ai as s,di as c,et as l,hi as u,ii as d,o as f,or as p,ri as m,sr as h,t as g,wi as _}from"./ScrollViewer-PoO_ma9Z.js";import{t as v}from"./Button-DjU0urmJ.js";import{t as y}from"./CheckBox-Cq84xW8n.js";import{t as b}from"./Image-Bse8ORbC.js";import{t as x}from"./StackPanel-CT7pl8zy.js";import{t as S}from"./ToggleButton-DwmhXZge.js";import{t as C}from"./ControlExample-C1ahTZEr.js";import{t as w}from"./pageState-BN3kXI7L.js";var T=`--- header
A simple Button with text content.
--- xaml
<Button Content="Standard XAML button" Click="Button_Click" $(IsEnabled)/>
--- c#
private void Button_Click(object sender, RoutedEventArgs e)
{
    // Handle button click
}`,E=`--- header
A Button with graphical content.
--- xaml
<Button Content="Button" Click="Button_Click" AutomationProperties.Name="Pie">
    <Image Source="/Assets/SampleMedia/Slices.png" AutomationProperties.Name="Slice"/>
</Button>`,D=`--- header
Built-in styles applied to Button.
--- xaml
<Button Style="{StaticResource AccentButtonStyle}" Content="Accent style button"/>
<Button Style="{StaticResource SubtleButtonStyle}" Content="Subtle style button"/>`,O=`--- header
Wrapping Buttons with large content
--- xaml
<StackPanel>
    <TextBlock Text="The following buttons' content may get clipped if we don't pay careful attention to their layout containers." Margin="0,0,0,8" TextWrapping="Wrap"/>
    <TextBlock Text="One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:" Margin="0,0,0,8" TextWrapping="Wrap"/>
    <Button HorizontalAlignment="Stretch" Margin="0,0,0,5">This is some text that is too long and will get cut off</Button>
    <Button HorizontalAlignment="Stretch">This is another text that would result in being cut off</Button>

    <TextBlock Text="Another option is to explicitly wrap the Button's content" Margin="0,8,0,8"/>
    <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
        <Button MaxWidth="240" Margin="0,0,8,0">
            <TextBlock Text="This is some text that is too long and will get cut off" TextWrapping="WrapWholeWords"/>
        </Button>
        <Button MaxWidth="240">
            <TextBlock Text="This is another text that would result in being cut off" TextWrapping="WrapWholeWords"/>
        </Button>
    </StackPanel>
</StackPanel>`,k=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ButtonPage : Page
{
    public ButtonPage()
    {
        this.InitializeComponent();
    }

    private void Button_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button b)
        {
            string name = b.Name;

            switch (name)
            {
                case "Button1":
                    Control1Output.Text = "You clicked: " + name;
                    break;
                case "Button2":
                    Control2Output.Text = "You clicked: " + name;
                    break;

            }
        }
    }
}
`,A={__name:`ButtonPage`,setup(e,{expose:t}){t();let{t:a}=l(),s=u(`currentPage`),{isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:A}=w(s?.value||`button`),j=i({});n(p,j);let M=m(()=>({PageTitle:a(`text.button`),Description:a(`text.the-button-control-provides-a-click-event-to-res`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`text.a-simple-button-with-text-content`),ImageHeader:a(`sample.button.with-image`),StylesHeader:a(`sample.button.built-in-styles`),WrappingHeader:a(`sample.button.wrapping`),StandardName:a(`sample.button.standard-name`),StandardButton:a(`sample.button.standard-xaml`),DisableButton:a(`sample.button.disable`),Pie:a(`sample.button.pie`),Slice:a(`sample.button.slice`),AccentName:a(`sample.button.accent-name`),AccentButton:a(`sample.button.accent-style`),SubtleName:a(`sample.button.subtle-name`),SubtleButton:a(`sample.button.subtle-style`),WrappingNote1:a(`sample.button.wrapping-note-1`),WrappingNote2:a(`sample.button.wrapping-note-2`),WrappingNote3:a(`sample.button.wrapping-note-3`),LongText1:a(`sample.button.long-text-1`),LongText2:a(`sample.button.long-text-2`),LongWrappingText1:a(`sample.button.long-text-1-wrapping`),LongWrappingText2:a(`sample.button.long-text-2-wrapping`)})),N=m(()=>a(c.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=m(()=>c.value?``:``),F=r(!1),I=r([``,``]),L=m(()=>I.value[0]?a(`sample.you-clicked`,{name:I.value[0]}):``),R=m(()=>I.value[1]?a(`sample.you-clicked`,{name:I.value[1]}):``),z=(e,t)=>{let n=e?.Name;n===`Button1`&&(I.value[0]=n),n===`Button2`&&(I.value[1]=n)},B=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,V=m(()=>B(T).replace(`$(IsEnabled)`,F.value?`IsEnabled="False" `:``)),H=B(E),U=B(D),W=B(O);n(h,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:A,IsButtonDisabled:F,Output1:L,Output2:R,Button_Click:z,SimpleXaml:V,ImageXaml:H,StylesXaml:U,WrappingXaml:W,ButtonCSharp:k});let G={t:a,currentPage:s,isFavoriteState:c,pageTheme:d,toggleTheme:_,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,IsButtonDisabled:F,clickedNames:I,Output1:L,Output2:R,Button_Click:z,codePart:B,SimpleXaml:V,ImageXaml:H,StylesXaml:U,WrappingXaml:W,computed:m,inject:u,provide:n,ref:r,shallowReactive:i,Button:v,CheckBox:y,ControlExample:C,FontIcon:o,Image:b,ScrollViewer:g,StackPanel:x,TextBlock:f,ToggleButton:S,get useI18n(){return l},get xamlNameScopeKey(){return p},get xamlScopeKey(){return h},get createPageState(){return w},get simpleDefinition(){return T},get imageDefinition(){return E},get stylesDefinition(){return D},get wrappingDefinition(){return O},get ButtonCSharp(){return k}};return Object.defineProperty(G,"__isScriptSetup",{enumerable:!1,value:!0}),G}},j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(n,r,i,a,o,l){let u=t(`ControlExampleSubstitution`);return _(),s(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[d(`div`,j,[d(`div`,M,[c(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),c(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(`div`,N,[c(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[c(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),c(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[c(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),c(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(a.ControlExample,{"x:Name":`Example1`,class:`button-example`,SampleDefinition:`Button\\ButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind ButtonCSharp}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.Button,{"x:Name":`Button1`,"AutomationProperties.Name":`{x:Bind Labels.StandardName, Mode=OneWay}`,Click:`Button_Click`,Content:`{x:Bind Labels.StandardButton, Mode=OneWay}`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}`})]),_:1}),c(a.ControlExample.Output,null,{default:e(()=>[c(a.TextBlock,{"x:Name":`Control1Output`,FontFamily:`Global User Interface`,Text:`{x:Bind Output1, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),c(a.ControlExample.Options,null,{default:e(()=>[c(a.StackPanel,null,{default:e(()=>[c(a.CheckBox,{"x:Name":`DisableButton1`,Content:`{x:Bind Labels.DisableButton, Mode=OneWay}`,IsChecked:`{x:Bind IsButtonDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),c(a.ControlExample.Substitutions,null,{default:e(()=>[c(u,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1}),c(a.ControlExample,{"x:Name":`Example2`,class:`button-example`,SampleDefinition:`Button\\ButtonWithImage.txt`,HeaderText:`{x:Bind Labels.ImageHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ImageXaml}`,CSharp:`{x:Bind ButtonCSharp}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.StackPanel,{Orientation:`Horizontal`},{default:e(()=>[c(a.Button,{"x:Name":`Button2`,Width:`50`,Height:`50`,"AutomationProperties.Name":`{x:Bind Labels.Pie, Mode=OneWay}`,Click:`Button_Click`},{default:e(()=>[c(a.Image,{"AutomationProperties.Name":`{x:Bind Labels.Slice, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png`})]),_:1})]),_:1})]),_:1}),c(a.ControlExample.Output,null,{default:e(()=>[c(a.TextBlock,{"x:Name":`Control2Output`,Text:`{x:Bind Output2, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),c(a.ControlExample.Options)]),_:1}),c(a.ControlExample,{class:`button-example`,SampleDefinition:`Button\\ButtonBuiltInStyles.txt`,HeaderText:`{x:Bind Labels.StylesHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind StylesXaml}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.StackPanel,{Orientation:`Horizontal`,Spacing:`16`},{default:e(()=>[c(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.AccentName, Mode=OneWay}`,Content:`{x:Bind Labels.AccentButton, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`}),c(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.SubtleName, Mode=OneWay}`,Content:`{x:Bind Labels.SubtleButton, Mode=OneWay}`,Style:`{StaticResource SubtleButtonStyle}`})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options)]),_:1}),c(a.ControlExample,{class:`button-example`,SampleDefinition:`Button\\ButtonWrapping.txt`,HeaderText:`{x:Bind Labels.WrappingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind WrappingXaml}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.StackPanel,null,{default:e(()=>[c(a.TextBlock,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote1, Mode=OneWay}`,TextWrapping:`Wrap`}),c(a.TextBlock,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote2, Mode=OneWay}`,TextWrapping:`Wrap`}),c(a.Button,{Margin:`0,0,0,5`,HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText1, Mode=OneWay}`}),c(a.Button,{HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText2, Mode=OneWay}`}),c(a.TextBlock,{Margin:`0,8,0,8`,Text:`{x:Bind Labels.WrappingNote3, Mode=OneWay}`,TextWrapping:`Wrap`}),c(a.StackPanel,{class:`wrapping-buttons`,HorizontalAlignment:`Center`,Orientation:`Horizontal`},{default:e(()=>[c(a.Button,{MaxWidth:`240`,Margin:`0,0,8,0`},{default:e(()=>[c(a.TextBlock,{Text:`{x:Bind Labels.LongWrappingText1, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),c(a.Button,{MaxWidth:`240`},{default:e(()=>[c(a.TextBlock,{Text:`{x:Bind Labels.LongWrappingText2, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options)]),_:1})]),_:1})])]),_:1})}var F=a(A,[[`render`,P],[`__scopeId`,`data-v-2a2357c8`],[`__file`,`ButtonPage.vue`]]);export{F as default};