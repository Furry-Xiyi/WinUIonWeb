import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-B43ymvAj.js";import{t as v}from"./Button-B49t7g4C.js";import{t as y}from"./Image-DEHWrAx2.js";import{t as b}from"./StackPanel-Dy6dKYi5.js";import{t as x}from"./ToggleButton-DDZy2gVz.js";import{t as S}from"./ControlExample-Ddvmn5_c.js";import{t as C}from"./CheckBox-fVMk0wr2.js";import{t as w}from"./pageState-BQHW0me4.js";var T=`--- header
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
`,A={class:`gallery-item-page`},j={class:`page-heading`},M={class:`page-header-actions`},N=r({__name:`ButtonPage`,setup(r){let{t:N}=h(),{isFavoriteState:P,pageTheme:F,toggleTheme:I,toggleFavorite:L}=w(s(`currentPage`)?.value||`button`);e(l,a({}));let R=c(()=>({PageTitle:N(`text.button`),Description:N(`text.the-button-control-provides-a-click-event-to-res`),ToggleTheme:N(`gallery.page-header.toggle-theme`),SimpleHeader:N(`text.a-simple-button-with-text-content`),ImageHeader:N(`sample.button.with-image`),StylesHeader:N(`sample.button.built-in-styles`),WrappingHeader:N(`sample.button.wrapping`),StandardName:N(`sample.button.standard-name`),StandardButton:N(`sample.button.standard-xaml`),DisableButton:N(`sample.button.disable`),Pie:N(`sample.button.pie`),Slice:N(`sample.button.slice`),AccentName:N(`sample.button.accent-name`),AccentButton:N(`sample.button.accent-style`),SubtleName:N(`sample.button.subtle-name`),SubtleButton:N(`sample.button.subtle-style`),WrappingNote1:N(`sample.button.wrapping-note-1`),WrappingNote2:N(`sample.button.wrapping-note-2`),WrappingNote3:N(`sample.button.wrapping-note-3`),LongText1:N(`sample.button.long-text-1`),LongText2:N(`sample.button.long-text-2`),LongWrappingText1:N(`sample.button.long-text-1-wrapping`),LongWrappingText2:N(`sample.button.long-text-2-wrapping`)})),z=c(()=>N(P.value?`gallery.remove-favorite`:`gallery.add-favorite`)),B=c(()=>P.value?``:``),V=n(!1),H=n([``,``]),U=c(()=>H.value[0]?N(`sample.you-clicked`,{name:H.value[0]}):``),W=c(()=>H.value[1]?N(`sample.you-clicked`,{name:H.value[1]}):``),G=(e,t)=>{let n=e?.Name;n===`Button1`&&(H.value[0]=n),n===`Button2`&&(H.value[1]=n)},K=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``;return e(u,{Labels:R,FavoriteLabel:z,FavoriteGlyph:B,isFavoriteState:P,pageTheme:F,toggleTheme:I,toggleFavorite:L,IsButtonDisabled:V,Output1:U,Output2:W,Button_Click:G,SimpleXaml:c(()=>K(T).replace(`$(IsEnabled)`,V.value?`IsEnabled="False" `:``)),ImageXaml:K(E),StylesXaml:K(D),WrappingXaml:K(O),ButtonCSharp:k}),(e,n)=>{let r=i(`ControlExampleSubstitution`);return f(),_(g,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,A,[p(`div`,j,[d(m,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(m,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,M,[d(v,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:``,FontSize:`16`})]),_:1}),d(x,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(o,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(b,{class:`gallery-page-content`},{default:t(()=>[d(S,{"x:Name":`Example1`,class:`button-example`,SampleDefinition:`Button\\ButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind ButtonCSharp}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(v,{"x:Name":`Button1`,"AutomationProperties.Name":`{x:Bind Labels.StandardName, Mode=OneWay}`,Click:`Button_Click`,Content:`{x:Bind Labels.StandardButton, Mode=OneWay}`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}`})]),_:1}),d(S.Output,null,{default:t(()=>[d(m,{"x:Name":`Control1Output`,FontFamily:`Global User Interface`,Text:`{x:Bind Output1, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(S.Options,null,{default:t(()=>[d(b,null,{default:t(()=>[d(C,{"x:Name":`DisableButton1`,Content:`{x:Bind Labels.DisableButton, Mode=OneWay}`,IsChecked:`{x:Bind IsButtonDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),d(S.Substitutions,null,{default:t(()=>[d(r,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1}),d(S,{"x:Name":`Example2`,class:`button-example`,SampleDefinition:`Button\\ButtonWithImage.txt`,HeaderText:`{x:Bind Labels.ImageHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ImageXaml}`,CSharp:`{x:Bind ButtonCSharp}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(b,{Orientation:`Horizontal`},{default:t(()=>[d(v,{"x:Name":`Button2`,Width:`50`,Height:`50`,"AutomationProperties.Name":`{x:Bind Labels.Pie, Mode=OneWay}`,Click:`Button_Click`},{default:t(()=>[d(y,{"AutomationProperties.Name":`{x:Bind Labels.Slice, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png`})]),_:1})]),_:1})]),_:1}),d(S.Output,null,{default:t(()=>[d(m,{"x:Name":`Control2Output`,Text:`{x:Bind Output2, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(S.Options)]),_:1}),d(S,{class:`button-example`,SampleDefinition:`Button\\ButtonBuiltInStyles.txt`,HeaderText:`{x:Bind Labels.StylesHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind StylesXaml}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(b,{Orientation:`Horizontal`,Spacing:`16`},{default:t(()=>[d(v,{"AutomationProperties.Name":`{x:Bind Labels.AccentName, Mode=OneWay}`,Content:`{x:Bind Labels.AccentButton, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`}),d(v,{"AutomationProperties.Name":`{x:Bind Labels.SubtleName, Mode=OneWay}`,Content:`{x:Bind Labels.SubtleButton, Mode=OneWay}`,Style:`{StaticResource SubtleButtonStyle}`})]),_:1})]),_:1}),d(S.Output),d(S.Options)]),_:1}),d(S,{class:`button-example`,SampleDefinition:`Button\\ButtonWrapping.txt`,HeaderText:`{x:Bind Labels.WrappingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind WrappingXaml}`},{default:t(()=>[d(S.Example,null,{default:t(()=>[d(b,null,{default:t(()=>[d(m,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote1, Mode=OneWay}`,TextWrapping:`Wrap`}),d(m,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote2, Mode=OneWay}`,TextWrapping:`Wrap`}),d(v,{Margin:`0,0,0,5`,HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText1, Mode=OneWay}`}),d(v,{HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText2, Mode=OneWay}`}),d(m,{Margin:`0,8,0,8`,Text:`{x:Bind Labels.WrappingNote3, Mode=OneWay}`,TextWrapping:`Wrap`}),d(b,{class:`wrapping-buttons`,HorizontalAlignment:`Center`,Orientation:`Horizontal`},{default:t(()=>[d(v,{MaxWidth:`240`,Margin:`0,0,8,0`},{default:t(()=>[d(m,{Text:`{x:Bind Labels.LongWrappingText1, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),d(v,{MaxWidth:`240`},{default:t(()=>[d(m,{Text:`{x:Bind Labels.LongWrappingText2, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),d(S.Output),d(S.Options)]),_:1})]),_:1})])]),_:1})}}},[[`__scopeId`,`data-v-2a2357c8`]]);export{N as default};