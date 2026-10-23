import{Ai as e,Di as t,Ei as n,Gi as r,Ki as i,Li as a,Wt as o,_i as s,a as c,ai as l,cr as u,et as d,o as f,oi as p,pi as m,si as h,sr as g,t as _}from"./ScrollViewer-BWDA_C78.js";import{t as v}from"./Button-BNDPNdYJ.js";import{t as y}from"./CheckBox-BArw_ebH.js";import{t as b}from"./Image-i6y7QZ_e.js";import{t as x}from"./StackPanel-sg_Bd5oB.js";import{t as S}from"./ToggleButton-HP5wmrvH.js";import{t as C}from"./ControlExample-CzGyf8u0.js";import{t as w}from"./pageState-CcJibQcm.js";var T=`--- header
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
`,A={__name:`ButtonPage`,setup(e,{expose:n}){n();let{t:a}=d(),o=s(`currentPage`),{isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:A}=w(o?.value||`button`),j=i({});t(g,j);let M=l(()=>({PageTitle:a(`text.button`),Description:a(`text.the-button-control-provides-a-click-event-to-res`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`text.a-simple-button-with-text-content`),ImageHeader:a(`sample.button.with-image`),StylesHeader:a(`sample.button.built-in-styles`),WrappingHeader:a(`sample.button.wrapping`),StandardName:a(`sample.button.standard-name`),StandardButton:a(`sample.button.standard-xaml`),DisableButton:a(`sample.button.disable`),Pie:a(`sample.button.pie`),Slice:a(`sample.button.slice`),AccentName:a(`sample.button.accent-name`),AccentButton:a(`sample.button.accent-style`),SubtleName:a(`sample.button.subtle-name`),SubtleButton:a(`sample.button.subtle-style`),WrappingNote1:a(`sample.button.wrapping-note-1`),WrappingNote2:a(`sample.button.wrapping-note-2`),WrappingNote3:a(`sample.button.wrapping-note-3`),LongText1:a(`sample.button.long-text-1`),LongText2:a(`sample.button.long-text-2`),LongWrappingText1:a(`sample.button.long-text-1-wrapping`),LongWrappingText2:a(`sample.button.long-text-2-wrapping`)})),N=l(()=>a(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=l(()=>p.value?``:``),F=r(!1),I=r([``,``]),L=l(()=>I.value[0]?a(`sample.you-clicked`,{name:I.value[0]}):``),R=l(()=>I.value[1]?a(`sample.you-clicked`,{name:I.value[1]}):``),z=(e,t)=>{let n=e?.Name;n===`Button1`&&(I.value[0]=n),n===`Button2`&&(I.value[1]=n)},B=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,V=l(()=>B(T).replace(`$(IsEnabled)`,F.value?`IsEnabled="False" `:``)),H=B(E),U=B(D),W=B(O);t(u,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:A,IsButtonDisabled:F,Output1:L,Output2:R,Button_Click:z,SimpleXaml:V,ImageXaml:H,StylesXaml:U,WrappingXaml:W,ButtonCSharp:k});let G={t:a,currentPage:o,isFavoriteState:p,pageTheme:m,toggleTheme:h,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,IsButtonDisabled:F,clickedNames:I,Output1:L,Output2:R,Button_Click:z,codePart:B,SimpleXaml:V,ImageXaml:H,StylesXaml:U,WrappingXaml:W,computed:l,inject:s,provide:t,ref:r,shallowReactive:i,Button:v,CheckBox:y,ControlExample:C,FontIcon:c,Image:b,ScrollViewer:_,StackPanel:x,TextBlock:f,ToggleButton:S,get useI18n(){return d},get xamlNameScopeKey(){return g},get xamlScopeKey(){return u},get createPageState(){return w},get simpleDefinition(){return T},get imageDefinition(){return E},get stylesDefinition(){return D},get wrappingDefinition(){return O},get ButtonCSharp(){return k}};return Object.defineProperty(G,"__isScriptSetup",{enumerable:!1,value:!0}),G}},j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(t,r,i,o,s,c){let l=e(`ControlExampleSubstitution`);return n(),h(o.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[p(`div`,j,[p(`div`,M,[m(o.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(o.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,N,[m(o.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[m(o.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(o.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[m(o.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),m(o.StackPanel,{class:`gallery-page-content`},{default:a(()=>[m(o.ControlExample,{"x:Name":`Example1`,class:`button-example`,SampleDefinition:`Button\\ButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind ButtonCSharp}`},{default:a(()=>[m(o.ControlExample.Example,null,{default:a(()=>[m(o.Button,{"x:Name":`Button1`,"AutomationProperties.Name":`{x:Bind Labels.StandardName, Mode=OneWay}`,Click:`Button_Click`,Content:`{x:Bind Labels.StandardButton, Mode=OneWay}`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}`})]),_:1}),m(o.ControlExample.Output,null,{default:a(()=>[m(o.TextBlock,{"x:Name":`Control1Output`,FontFamily:`Global User Interface`,Text:`{x:Bind Output1, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(o.ControlExample.Options,null,{default:a(()=>[m(o.StackPanel,null,{default:a(()=>[m(o.CheckBox,{"x:Name":`DisableButton1`,Content:`{x:Bind Labels.DisableButton, Mode=OneWay}`,IsChecked:`{x:Bind IsButtonDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),m(o.ControlExample.Substitutions,null,{default:a(()=>[m(l,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1}),m(o.ControlExample,{"x:Name":`Example2`,class:`button-example`,SampleDefinition:`Button\\ButtonWithImage.txt`,HeaderText:`{x:Bind Labels.ImageHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ImageXaml}`,CSharp:`{x:Bind ButtonCSharp}`},{default:a(()=>[m(o.ControlExample.Example,null,{default:a(()=>[m(o.StackPanel,{Orientation:`Horizontal`},{default:a(()=>[m(o.Button,{"x:Name":`Button2`,Width:`50`,Height:`50`,"AutomationProperties.Name":`{x:Bind Labels.Pie, Mode=OneWay}`,Click:`Button_Click`},{default:a(()=>[m(o.Image,{"AutomationProperties.Name":`{x:Bind Labels.Slice, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png`})]),_:1})]),_:1})]),_:1}),m(o.ControlExample.Output,null,{default:a(()=>[m(o.TextBlock,{"x:Name":`Control2Output`,Text:`{x:Bind Output2, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(o.ControlExample.Options)]),_:1}),m(o.ControlExample,{class:`button-example`,SampleDefinition:`Button\\ButtonBuiltInStyles.txt`,HeaderText:`{x:Bind Labels.StylesHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind StylesXaml}`},{default:a(()=>[m(o.ControlExample.Example,null,{default:a(()=>[m(o.StackPanel,{Orientation:`Horizontal`,Spacing:`16`},{default:a(()=>[m(o.Button,{"AutomationProperties.Name":`{x:Bind Labels.AccentName, Mode=OneWay}`,Content:`{x:Bind Labels.AccentButton, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`}),m(o.Button,{"AutomationProperties.Name":`{x:Bind Labels.SubtleName, Mode=OneWay}`,Content:`{x:Bind Labels.SubtleButton, Mode=OneWay}`,Style:`{StaticResource SubtleButtonStyle}`})]),_:1})]),_:1}),m(o.ControlExample.Output),m(o.ControlExample.Options)]),_:1}),m(o.ControlExample,{class:`button-example`,SampleDefinition:`Button\\ButtonWrapping.txt`,HeaderText:`{x:Bind Labels.WrappingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind WrappingXaml}`},{default:a(()=>[m(o.ControlExample.Example,null,{default:a(()=>[m(o.StackPanel,null,{default:a(()=>[m(o.TextBlock,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote1, Mode=OneWay}`,TextWrapping:`Wrap`}),m(o.TextBlock,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote2, Mode=OneWay}`,TextWrapping:`Wrap`}),m(o.Button,{Margin:`0,0,0,5`,HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText1, Mode=OneWay}`}),m(o.Button,{HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText2, Mode=OneWay}`}),m(o.TextBlock,{Margin:`0,8,0,8`,Text:`{x:Bind Labels.WrappingNote3, Mode=OneWay}`,TextWrapping:`Wrap`}),m(o.StackPanel,{class:`wrapping-buttons`,HorizontalAlignment:`Center`,Orientation:`Horizontal`},{default:a(()=>[m(o.Button,{MaxWidth:`240`,Margin:`0,0,8,0`},{default:a(()=>[m(o.TextBlock,{Text:`{x:Bind Labels.LongWrappingText1, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),m(o.Button,{MaxWidth:`240`},{default:a(()=>[m(o.TextBlock,{Text:`{x:Bind Labels.LongWrappingText2, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),m(o.ControlExample.Output),m(o.ControlExample.Options)]),_:1})]),_:1})])]),_:1})}var F=o(A,[[`render`,P],[`__scopeId`,`data-v-2a2357c8`],[`__file`,`ButtonPage.vue`]]);export{F as default};