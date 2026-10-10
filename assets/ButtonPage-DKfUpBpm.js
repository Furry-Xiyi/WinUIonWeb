import{Ai as e,Bi as t,Ji as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,li as p,o as m,p as h,t as g,ui as _}from"./ScrollViewer-CHNE18MA.js";import{t as v}from"./Button-DO0TiUOq.js";import{t as y}from"./Image-BKiqvBIm.js";import{t as b}from"./StackPanel-C60XOD66.js";import{t as x}from"./ToggleButton-ZsjZg8Nu.js";import{t as S}from"./ControlExample-BKyw2NwY.js";import{t as C}from"./CheckBox-CNlZofm9.js";import{t as w}from"./pageState-Djrh7EdY.js";var T=`--- header
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
`,A={__name:`ButtonPage`,setup(t,{expose:r}){r();let{t:i}=h(),d=s(`currentPage`),{isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:A}=w(d?.value||`button`),j=a({});e(l,j);let M=c(()=>({PageTitle:i(`text.button`),Description:i(`text.the-button-control-provides-a-click-event-to-res`),ToggleTheme:i(`gallery.page-header.toggle-theme`),SimpleHeader:i(`text.a-simple-button-with-text-content`),ImageHeader:i(`sample.button.with-image`),StylesHeader:i(`sample.button.built-in-styles`),WrappingHeader:i(`sample.button.wrapping`),StandardName:i(`sample.button.standard-name`),StandardButton:i(`sample.button.standard-xaml`),DisableButton:i(`sample.button.disable`),Pie:i(`sample.button.pie`),Slice:i(`sample.button.slice`),AccentName:i(`sample.button.accent-name`),AccentButton:i(`sample.button.accent-style`),SubtleName:i(`sample.button.subtle-name`),SubtleButton:i(`sample.button.subtle-style`),WrappingNote1:i(`sample.button.wrapping-note-1`),WrappingNote2:i(`sample.button.wrapping-note-2`),WrappingNote3:i(`sample.button.wrapping-note-3`),LongText1:i(`sample.button.long-text-1`),LongText2:i(`sample.button.long-text-2`),LongWrappingText1:i(`sample.button.long-text-1-wrapping`),LongWrappingText2:i(`sample.button.long-text-2-wrapping`)})),N=c(()=>i(f.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=c(()=>f.value?``:``),F=n(!1),I=n([``,``]),L=c(()=>I.value[0]?i(`sample.you-clicked`,{name:I.value[0]}):``),R=c(()=>I.value[1]?i(`sample.you-clicked`,{name:I.value[1]}):``),z=(e,t)=>{let n=e?.Name;n===`Button1`&&(I.value[0]=n),n===`Button2`&&(I.value[1]=n)},B=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,V=c(()=>B(T).replace(`$(IsEnabled)`,F.value?`IsEnabled="False" `:``)),H=B(E),U=B(D),W=B(O);e(u,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:A,IsButtonDisabled:F,Output1:L,Output2:R,Button_Click:z,SimpleXaml:V,ImageXaml:H,StylesXaml:U,WrappingXaml:W,ButtonCSharp:k});let G={t:i,currentPage:d,isFavoriteState:f,pageTheme:p,toggleTheme:_,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,IsButtonDisabled:F,clickedNames:I,Output1:L,Output2:R,Button_Click:z,codePart:B,SimpleXaml:V,ImageXaml:H,StylesXaml:U,WrappingXaml:W,computed:c,inject:s,provide:e,ref:n,shallowReactive:a,Button:v,CheckBox:C,ControlExample:S,FontIcon:o,Image:y,ScrollViewer:g,StackPanel:b,TextBlock:m,ToggleButton:x,get useI18n(){return h},get xamlNameScopeKey(){return l},get xamlScopeKey(){return u},get createPageState(){return w},get simpleDefinition(){return T},get imageDefinition(){return E},get stylesDefinition(){return D},get wrappingDefinition(){return O},get ButtonCSharp(){return k}};return Object.defineProperty(G,"__isScriptSetup",{enumerable:!1,value:!0}),G}},j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(e,n,r,a,o,s){let c=i(`ControlExampleSubstitution`);return f(),_(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[p(`div`,j,[p(`div`,M,[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,N,[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[d(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[d(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(a.StackPanel,{class:`gallery-page-content`},{default:t(()=>[d(a.ControlExample,{"x:Name":`Example1`,class:`button-example`,SampleDefinition:`Button\\ButtonSimple.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml, Mode=OneWay}`,CSharp:`{x:Bind ButtonCSharp}`},{default:t(()=>[d(a.ControlExample.Example,null,{default:t(()=>[d(a.Button,{"x:Name":`Button1`,"AutomationProperties.Name":`{x:Bind Labels.StandardName, Mode=OneWay}`,Click:`Button_Click`,Content:`{x:Bind Labels.StandardButton, Mode=OneWay}`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}`})]),_:1}),d(a.ControlExample.Output,null,{default:t(()=>[d(a.TextBlock,{"x:Name":`Control1Output`,FontFamily:`Global User Interface`,Text:`{x:Bind Output1, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options,null,{default:t(()=>[d(a.StackPanel,null,{default:t(()=>[d(a.CheckBox,{"x:Name":`DisableButton1`,Content:`{x:Bind Labels.DisableButton, Mode=OneWay}`,IsChecked:`{x:Bind IsButtonDisabled, Mode=TwoWay}`})]),_:1})]),_:1}),d(a.ControlExample.Substitutions,null,{default:t(()=>[d(c,{Key:`IsEnabled`,IsEnabled:`{x:Bind DisableButton1.IsChecked.Value, Mode=OneWay}`,Value:`IsEnabled="False" `})]),_:1})]),_:1}),d(a.ControlExample,{"x:Name":`Example2`,class:`button-example`,SampleDefinition:`Button\\ButtonWithImage.txt`,HeaderText:`{x:Bind Labels.ImageHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ImageXaml}`,CSharp:`{x:Bind ButtonCSharp}`},{default:t(()=>[d(a.ControlExample.Example,null,{default:t(()=>[d(a.StackPanel,{Orientation:`Horizontal`},{default:t(()=>[d(a.Button,{"x:Name":`Button2`,Width:`50`,Height:`50`,"AutomationProperties.Name":`{x:Bind Labels.Pie, Mode=OneWay}`,Click:`Button_Click`},{default:t(()=>[d(a.Image,{"AutomationProperties.Name":`{x:Bind Labels.Slice, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png`})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output,null,{default:t(()=>[d(a.TextBlock,{"x:Name":`Control2Output`,Text:`{x:Bind Output2, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),d(a.ControlExample.Options)]),_:1}),d(a.ControlExample,{class:`button-example`,SampleDefinition:`Button\\ButtonBuiltInStyles.txt`,HeaderText:`{x:Bind Labels.StylesHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind StylesXaml}`},{default:t(()=>[d(a.ControlExample.Example,null,{default:t(()=>[d(a.StackPanel,{Orientation:`Horizontal`,Spacing:`16`},{default:t(()=>[d(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.AccentName, Mode=OneWay}`,Content:`{x:Bind Labels.AccentButton, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`}),d(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.SubtleName, Mode=OneWay}`,Content:`{x:Bind Labels.SubtleButton, Mode=OneWay}`,Style:`{StaticResource SubtleButtonStyle}`})]),_:1})]),_:1}),d(a.ControlExample.Output),d(a.ControlExample.Options)]),_:1}),d(a.ControlExample,{class:`button-example`,SampleDefinition:`Button\\ButtonWrapping.txt`,HeaderText:`{x:Bind Labels.WrappingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind WrappingXaml}`},{default:t(()=>[d(a.ControlExample.Example,null,{default:t(()=>[d(a.StackPanel,null,{default:t(()=>[d(a.TextBlock,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote1, Mode=OneWay}`,TextWrapping:`Wrap`}),d(a.TextBlock,{Margin:`0,0,0,8`,Text:`{x:Bind Labels.WrappingNote2, Mode=OneWay}`,TextWrapping:`Wrap`}),d(a.Button,{Margin:`0,0,0,5`,HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText1, Mode=OneWay}`}),d(a.Button,{HorizontalAlignment:`Stretch`,Content:`{x:Bind Labels.LongText2, Mode=OneWay}`}),d(a.TextBlock,{Margin:`0,8,0,8`,Text:`{x:Bind Labels.WrappingNote3, Mode=OneWay}`,TextWrapping:`Wrap`}),d(a.StackPanel,{class:`wrapping-buttons`,HorizontalAlignment:`Center`,Orientation:`Horizontal`},{default:t(()=>[d(a.Button,{MaxWidth:`240`,Margin:`0,0,8,0`},{default:t(()=>[d(a.TextBlock,{Text:`{x:Bind Labels.LongWrappingText1, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),d(a.Button,{MaxWidth:`240`},{default:t(()=>[d(a.TextBlock,{Text:`{x:Bind Labels.LongWrappingText2, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1}),d(a.ControlExample.Output),d(a.ControlExample.Options)]),_:1})]),_:1})])]),_:1})}var F=r(A,[[`render`,P],[`__scopeId`,`data-v-2a2357c8`],[`__file`,`ButtonPage.vue`]]);export{F as default};