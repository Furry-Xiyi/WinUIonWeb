import{Ai as e,Bi as t,Ci as n,Cn as r,Ei as i,En as a,Ji as o,Mn as s,Ni as c,Yi as l,a as u,bi as d,ci as f,dr as ee,fr as p,gi as m,hi as h,ki as g,li as _,o as v,p as y,t as b,ui as x}from"./ScrollViewer-B43ymvAj.js";import{n as S}from"./ContentPresenter-7i8kdghk.js";import{t as C}from"./Button-B49t7g4C.js";import{t as w}from"./Flyout-DRenxRIy.js";import{t as T}from"./StackPanel-Dy6dKYi5.js";import{t as E}from"./ToggleButton-DDZy2gVz.js";import{t as D}from"./RichEditBox-DDlQaZkc.js";import{t as O}from"./ControlExample-Ddvmn5_c.js";import{t as k}from"./VariableSizedWrapGrid-n_pTWfbT.js";import{t as A}from"./Rectangle-zyyWCgfm.js";import{t as j}from"./SplitButton-rK_AkuOj.js";import{t as M}from"./pageState-BQHW0me4.js";import{t as N}from"./GridView-VSxCF_51.js";var P=`--- header
A SplitButton controlling text color in a RichEditBox
--- xaml
<SplitButton x:Name="myColorButton" Click="myColorButton_Click">
    <Border x:Name="CurrentColor" Width="32" Height="32" Background="Green" CornerRadius="4,0,0,4"/>
    <SplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </SplitButton.Flyout>
</SplitButton>`,F=`--- header
A SplitButton with text
--- xaml
<SplitButton x:Name="myColorButton">
    Choose color
    <SplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </SplitButton.Flyout>
</SplitButton>`,I=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Shapes;
using System.Threading.Tasks;

namespace WinUIGallery.ControlPages;

public sealed partial class SplitButtonPage : Page
{
    private Windows.UI.Color currentColor = Colors.Green;

    public SplitButtonPage()
    {
        this.InitializeComponent();

        myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
        myRichEditBox.Document.Selection.SetText(Microsoft.UI.Text.TextSetOptions.None,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
            "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor commodo ullamcorper a lacus.");
    }

    private void GridView_ItemClick(object sender, ItemClickEventArgs e)
    {
        var rect = (Rectangle)e.ClickedItem;
        var color = ((SolidColorBrush)rect.Fill).Color;
        myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = color;
        CurrentColor.Background = new SolidColorBrush(color);

        myRichEditBox.Focus(Microsoft.UI.Xaml.FocusState.Keyboard);
        currentColor = color;

        // Delay required to circumvent GridView bug: https://github.com/microsoft/microsoft-ui-xaml/issues/6350
        Task.Delay(10).ContinueWith(_ => myColorButton.Flyout.Hide(), TaskScheduler.FromCurrentSynchronizationContext());
    }

    private void RevealColorButton_Click(object sender, RoutedEventArgs e)
    {
        myColorButtonReveal.Flyout.Hide();
    }

    private void myColorButton_Click(Microsoft.UI.Xaml.Controls.SplitButton sender, Microsoft.UI.Xaml.Controls.SplitButtonClickEventArgs args)
    {
        var border = (Border)sender.Content;
        var color = ((Microsoft.UI.Xaml.Media.SolidColorBrush)border.Background).Color;

        myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = color;
        currentColor = color;
    }

    private void MyRichEditBox_TextChanged(object sender, RoutedEventArgs e)
    {
        if (myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor != currentColor)
        {
            myRichEditBox.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
        }
    }
}
`,L={class:`gallery-item-page`},R={class:`page-heading`},z={class:`page-header-actions`},B=s({__name:`SplitButtonPage`,setup(s){let{t:B}=y(),{isFavoriteState:V,pageTheme:H,toggleTheme:U,toggleFavorite:W}=M(d(`currentPage`)?.value||`splitbutton`),G=l({});e(ee,G);let K=f(()=>({PageTitle:B(`text.splitbutton`),Description:B(`text.the-splitbutton-is-a-dropdown-button-but-with-an`),ToggleTheme:B(`gallery.page-header.toggle-theme`),ColorHeader:B(`sample.splitbutton.color-picker`),TextHeader:B(`sample.splitbutton.text`),FontColor:B(`sample.splitbutton.font-color`),FontColorWithText:B(`sample.splitbutton.font-color-with-text`),ChooseColor:B(`sample.choose-color`),Placeholder:B(`sample.type-something-here`),Red:B(`text.red`),Orange:B(`sample.orange`),Yellow:B(`text.yellow`),Green:B(`text.green`),Blue:B(`text.blue`),Indigo:B(`sample.indigo`),Violet:B(`sample.violet`),Gray:B(`sample.gray`),Black:B(`sample.black`)})),q=f(()=>B(V.value?`gallery.remove-favorite`:`gallery.add-favorite`)),J=f(()=>V.value?``:``),Y=o(`Green`),X=o(B(`sample.splitbutton.rich-text`)),Z=!1,Q=(e=!1)=>{if(!Z){Z=!0;try{let t=G.myRichEditBox;if(!t)return;e&&t.Document.Selection.StartPosition===t.Document.Selection.EndPosition&&t.Document.Selection.SetRange(0,2**53-1),t.Document.Selection.CharacterFormat.ForegroundColor=Y.value}finally{Z=!1}}},te=async(e,t)=>{let r=t?.ClickedItem,i=r?.Fill??r?.props?.Fill;typeof i==`string`&&(Y.value=i,Q(),await n(),G.myColorButton?.Flyout?.Hide?.(),G.myRichEditBox?.Focus(`Keyboard`))},ne=(e,t)=>{G.myColorButtonReveal?.Flyout?.Hide?.()},re=(e,t)=>Q(),ie=(e,t)=>Q(!1);i(async()=>{await n(),Z=!0;try{let e=G.myRichEditBox;e&&(e.Document.SetText(`None`,X.value),e.Document.GetRange(0,2**53-1).CharacterFormat.ForegroundColor=Y.value)}finally{Z=!1}});let $=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``;return e(p,{Labels:K,FavoriteLabel:q,FavoriteGlyph:J,isFavoriteState:V,pageTheme:H,toggleTheme:U,toggleFavorite:W,CurrentColorValue:Y,EditorText:X,GridView_ItemClick:te,RevealColorButton_Click:ne,myColorButton_Click:re,MyRichEditBox_TextChanged:ie,ColorXaml:$(P),TextXaml:$(F),SplitCSharp:I}),(e,n)=>{let i=c(`x:Double`),o=c(`ItemsWrapGrid`),s=c(`ItemsPanelTemplate`),l=c(`Setter`),d=c(`Style`);return g(),x(r,null,{default:t(()=>[m(r.Resources,null,{default:t(()=>[m(i,{"x:Key":`SwatchSize`},{default:t(()=>[...n[0]||=[h(`32`,-1)]]),_:1})]),_:1}),m(b,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[_(`div`,L,[_(`div`,R,[m(v,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(v,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(`div`,z,[m(C,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[m(u,{Glyph:``,FontSize:`16`})]),_:1}),m(E,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[m(u,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),m(T,{class:`gallery-page-content`},{default:t(()=>[m(O,{"x:Name":`Example1`,class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonColorPicker.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.ColorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ColorXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:t(()=>[m(O.Example,null,{default:t(()=>[m(a,{"x:Name":`Control1`,ColumnSpacing:`24`},{default:t(()=>[m(j,{"x:Name":`myColorButton`,MinWidth:`0`,MinHeight:`0`,Padding:`0`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColor, Mode=OneWay}`,Click:`myColorButton_Click`},{default:t(()=>[m(S,{"x:Name":`CurrentColor`,Width:`{StaticResource SwatchSize}`,Height:`{StaticResource SwatchSize}`,Margin:`0`,Background:`{x:Bind CurrentColorValue, Mode=OneWay}`,CornerRadius:`4,0,0,4`}),m(j.Flyout,null,{default:t(()=>[m(w,{Placement:`Bottom`},{default:t(()=>[m(N,{IsItemClickEnabled:`True`,ItemClick:`GridView_ItemClick`},{default:t(()=>[m(N.ItemsPanel,null,{default:t(()=>[m(s,null,{default:t(()=>[m(o,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`})]),_:1})]),_:1}),m(N.Resources,null,{default:t(()=>[m(d,{TargetType:`Rectangle`},{default:t(()=>[m(l,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),m(l,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),m(l,{Property:`RadiusX`,Value:`4`}),m(l,{Property:`RadiusY`,Value:`4`})]),_:1})]),_:1}),m(N.Items,null,{default:t(()=>[m(A,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Fill:`Red`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Fill:`Orange`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Fill:`Yellow`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Fill:`Green`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Fill:`Blue`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Fill:`Indigo`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Fill:`Violet`}),m(A,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Fill:`Gray`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(O.Output),m(O.Options,null,{default:t(()=>[m(D,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,PlaceholderText:`{x:Bind Labels.Placeholder, Mode=OneWay}`,TextChanged:`MyRichEditBox_TextChanged`})]),_:1})]),_:1}),m(O,{class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonText.txt`,HeaderText:`{x:Bind Labels.TextHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TextXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:t(()=>[m(O.Example,null,{default:t(()=>[m(j,{"x:Name":`myColorButtonReveal`,MinWidth:`0`,MinHeight:`0`,Padding:`5`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColorWithText, Mode=OneWay}`,Content:`{x:Bind Labels.ChooseColor, Mode=OneWay}`},{default:t(()=>[m(j.Flyout,null,{default:t(()=>[m(w,{Placement:`Bottom`},{default:t(()=>[m(k,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`},{default:t(()=>[m(k.Resources,null,{default:t(()=>[m(d,{TargetType:`Rectangle`},{default:t(()=>[m(l,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),m(l,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),m(l,{Property:`RadiusX`,Value:`4`}),m(l,{Property:`RadiusY`,Value:`4`})]),_:1}),m(d,{TargetType:`Button`},{default:t(()=>[m(l,{Property:`Padding`,Value:`0`}),m(l,{Property:`MinWidth`,Value:`0`}),m(l,{Property:`MinHeight`,Value:`0`}),m(l,{Property:`Margin`,Value:`6`}),m(l,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Red`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Orange`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Yellow`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Green`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Blue`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Indigo`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Violet`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Gray`})]),_:1})]),_:1}),m(C,{"AutomationProperties.Name":`{x:Bind Labels.Black, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[m(C.Content,null,{default:t(()=>[m(A,{Fill:`Black`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(O.Output),m(O.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}}},[[`__scopeId`,`data-v-518ab18c`]]);export{B as default};