import{Ai as e,Ci as t,Di as n,Ei as r,Gi as i,I as a,Ki as o,Li as s,Lt as c,Wt as l,_i as u,a as d,ai as f,bi as p,cr as m,et as h,fi as g,o as _,oi as v,pi as y,si as b,sr as x,t as S}from"./ScrollViewer-BWDA_C78.js";import{n as C}from"./ContentPresenter-DMSXUCwi.js";import{t as w}from"./Button-BNDPNdYJ.js";import{t as T}from"./Flyout-C3sOZyEQ.js";import{t as E}from"./Rectangle-BObi0TNt.js";import{t as D}from"./GridView-bN2cIfZT.js";import{t as O}from"./StackPanel-sg_Bd5oB.js";import{t as k}from"./RichEditBox-56YTK8rU.js";import{t as A}from"./SplitButton-B8hnVk7f.js";import{t as j}from"./ToggleButton-HP5wmrvH.js";import{t as M}from"./VariableSizedWrapGrid-di1JD02l.js";import{t as N}from"./ControlExample-CzGyf8u0.js";import{t as P}from"./pageState-CcJibQcm.js";var F=`--- header
A SplitButton controlling text color in a RichEditBox
--- xaml
<SplitButton x:Name="myColorButton" Click="myColorButton_Click">
    <Border x:Name="CurrentColor" Width="32" Height="32" Background="Green" CornerRadius="4,0,0,4"/>
    <SplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </SplitButton.Flyout>
</SplitButton>`,I=`--- header
A SplitButton with text
--- xaml
<SplitButton x:Name="myColorButton">
    Choose color
    <SplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </SplitButton.Flyout>
</SplitButton>`,L=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,R={__name:`SplitButtonPage`,setup(e,{expose:r}){r();let{t:s}=h(),l=u(`currentPage`),{isFavoriteState:g,pageTheme:v,toggleTheme:y,toggleFavorite:b}=P(l?.value||`splitbutton`),R=o({});n(x,R);let z=f(()=>({PageTitle:s(`text.splitbutton`),Description:s(`text.the-splitbutton-is-a-dropdown-button-but-with-an`),ToggleTheme:s(`gallery.page-header.toggle-theme`),ColorHeader:s(`sample.splitbutton.color-picker`),TextHeader:s(`sample.splitbutton.text`),FontColor:s(`sample.splitbutton.font-color`),FontColorWithText:s(`sample.splitbutton.font-color-with-text`),ChooseColor:s(`sample.choose-color`),Placeholder:s(`sample.type-something-here`),Red:s(`text.red`),Orange:s(`sample.orange`),Yellow:s(`text.yellow`),Green:s(`text.green`),Blue:s(`text.blue`),Indigo:s(`sample.indigo`),Violet:s(`sample.violet`),Gray:s(`sample.gray`),Black:s(`sample.black`)})),B=f(()=>s(g.value?`gallery.remove-favorite`:`gallery.add-favorite`)),V=f(()=>g.value?``:``),H=i(`Green`),U=i(s(`sample.splitbutton.rich-text`)),W=!1,G=(e=!1)=>{if(!W){W=!0;try{let t=R.myRichEditBox;if(!t)return;e&&t.Document.Selection.StartPosition===t.Document.Selection.EndPosition&&t.Document.Selection.SetRange(0,2**53-1),t.Document.Selection.CharacterFormat.ForegroundColor=H.value}finally{W=!1}}},K=async(e,t)=>{let n=t?.ClickedItem,r=n?.Fill??n?.props?.Fill;typeof r==`string`&&(H.value=r,G(),await p(),R.myColorButton?.Flyout?.Hide?.(),R.myRichEditBox?.Focus(`Keyboard`))},q=(e,t)=>{R.myColorButtonReveal?.Flyout?.Hide?.()},J=(e,t)=>G(),Y=(e,t)=>G(!1);t(async()=>{await p(),W=!0;try{let e=R.myRichEditBox;e&&(e.Document.SetText(`None`,U.value),e.Document.GetRange(0,2**53-1).CharacterFormat.ForegroundColor=H.value)}finally{W=!1}});let X=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,Z=X(F),Q=X(I);n(m,{Labels:z,FavoriteLabel:B,FavoriteGlyph:V,isFavoriteState:g,pageTheme:v,toggleTheme:y,toggleFavorite:b,CurrentColorValue:H,EditorText:U,GridView_ItemClick:K,RevealColorButton_Click:q,myColorButton_Click:J,MyRichEditBox_TextChanged:Y,ColorXaml:Z,TextXaml:Q,SplitCSharp:L});let $={t:s,currentPage:l,isFavoriteState:g,pageTheme:v,toggleTheme:y,toggleFavorite:b,Names:R,Labels:z,FavoriteLabel:B,FavoriteGlyph:V,CurrentColorValue:H,EditorText:U,get applyingColor(){return W},set applyingColor(e){W=e},applyColor:G,GridView_ItemClick:K,RevealColorButton_Click:q,myColorButton_Click:J,MyRichEditBox_TextChanged:Y,codePart:X,ColorXaml:Z,TextXaml:Q,computed:f,inject:u,nextTick:p,onMounted:t,provide:n,ref:i,shallowReactive:o,Border:C,Button:w,ControlExample:N,Flyout:T,FontIcon:d,Grid:c,GridView:D,Page:a,Rectangle:E,RichEditBox:k,ScrollViewer:S,SplitButton:A,StackPanel:O,TextBlock:_,ToggleButton:j,VariableSizedWrapGrid:M,get useI18n(){return h},get xamlNameScopeKey(){return x},get xamlScopeKey(){return m},get createPageState(){return P},get colorDefinition(){return F},get textDefinition(){return I},get SplitCSharp(){return L}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}},z={class:`gallery-item-page`},B={class:`page-heading`},V={class:`page-header-actions`};function H(t,n,i,a,o,c){let l=e(`x:Double`),u=e(`ItemsWrapGrid`),d=e(`ItemsPanelTemplate`),f=e(`Setter`),p=e(`Style`);return r(),b(a.Page,null,{default:s(()=>[y(a.Page.Resources,null,{default:s(()=>[y(l,{"x:Key":`SwatchSize`},{default:s(()=>[...n[0]||=[g(`32`,-1)]]),_:1})]),_:1}),y(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:s(()=>[v(`div`,z,[v(`div`,B,[y(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),y(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),v(`div`,V,[y(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:s(()=>[y(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),y(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:s(()=>[y(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),y(a.StackPanel,{class:`gallery-page-content`},{default:s(()=>[y(a.ControlExample,{"x:Name":`Example1`,class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonColorPicker.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.ColorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ColorXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:s(()=>[y(a.ControlExample.Example,null,{default:s(()=>[y(a.Grid,{"x:Name":`Control1`,ColumnSpacing:`24`},{default:s(()=>[y(a.SplitButton,{"x:Name":`myColorButton`,MinWidth:`0`,MinHeight:`0`,Padding:`0`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColor, Mode=OneWay}`,Click:`myColorButton_Click`},{default:s(()=>[y(a.Border,{"x:Name":`CurrentColor`,Width:`{StaticResource SwatchSize}`,Height:`{StaticResource SwatchSize}`,Margin:`0`,Background:`{x:Bind CurrentColorValue, Mode=OneWay}`,CornerRadius:`4,0,0,4`}),y(a.SplitButton.Flyout,null,{default:s(()=>[y(a.Flyout,{Placement:`Bottom`},{default:s(()=>[y(a.GridView,{IsItemClickEnabled:`True`,ItemClick:`GridView_ItemClick`},{default:s(()=>[y(a.GridView.ItemsPanel,null,{default:s(()=>[y(d,null,{default:s(()=>[y(u,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`})]),_:1})]),_:1}),y(a.GridView.Resources,null,{default:s(()=>[y(p,{TargetType:`Rectangle`},{default:s(()=>[y(f,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),y(f,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),y(f,{Property:`RadiusX`,Value:`4`}),y(f,{Property:`RadiusY`,Value:`4`})]),_:1})]),_:1}),y(a.GridView.Items,null,{default:s(()=>[y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Fill:`Red`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Fill:`Orange`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Fill:`Yellow`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Fill:`Green`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Fill:`Blue`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Fill:`Indigo`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Fill:`Violet`}),y(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Fill:`Gray`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),y(a.ControlExample.Output),y(a.ControlExample.Options,null,{default:s(()=>[y(a.RichEditBox,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,PlaceholderText:`{x:Bind Labels.Placeholder, Mode=OneWay}`,TextChanged:`MyRichEditBox_TextChanged`})]),_:1})]),_:1}),y(a.ControlExample,{class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonText.txt`,HeaderText:`{x:Bind Labels.TextHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TextXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:s(()=>[y(a.ControlExample.Example,null,{default:s(()=>[y(a.SplitButton,{"x:Name":`myColorButtonReveal`,MinWidth:`0`,MinHeight:`0`,Padding:`5`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColorWithText, Mode=OneWay}`,Content:`{x:Bind Labels.ChooseColor, Mode=OneWay}`},{default:s(()=>[y(a.SplitButton.Flyout,null,{default:s(()=>[y(a.Flyout,{Placement:`Bottom`},{default:s(()=>[y(a.VariableSizedWrapGrid,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`},{default:s(()=>[y(a.VariableSizedWrapGrid.Resources,null,{default:s(()=>[y(p,{TargetType:`Rectangle`},{default:s(()=>[y(f,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),y(f,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),y(f,{Property:`RadiusX`,Value:`4`}),y(f,{Property:`RadiusY`,Value:`4`})]),_:1}),y(p,{TargetType:`Button`},{default:s(()=>[y(f,{Property:`Padding`,Value:`0`}),y(f,{Property:`MinWidth`,Value:`0`}),y(f,{Property:`MinHeight`,Value:`0`}),y(f,{Property:`Margin`,Value:`6`}),y(f,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Red`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Orange`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Yellow`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Green`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Blue`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Indigo`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Violet`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Gray`})]),_:1})]),_:1}),y(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Black, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:s(()=>[y(a.Button.Content,null,{default:s(()=>[y(a.Rectangle,{Fill:`Black`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),y(a.ControlExample.Output),y(a.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var U=l(R,[[`render`,H],[`__scopeId`,`data-v-518ab18c`],[`__file`,`SplitButtonPage.vue`]]);export{U as default};