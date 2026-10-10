import{Ai as e,Bi as t,Ci as n,Cn as r,Ei as i,En as a,Ji as o,Mn as s,Ni as c,Yi as l,a as u,bi as d,ci as f,dr as p,fr as m,gi as h,hi as g,ki as _,li as v,o as y,p as b,t as x,ui as S}from"./ScrollViewer-CHNE18MA.js";import{n as C}from"./ContentPresenter-pBVZeWXF.js";import{t as w}from"./Button-DO0TiUOq.js";import{t as T}from"./Flyout-8D4iwnYI.js";import{t as E}from"./StackPanel-C60XOD66.js";import{t as D}from"./ToggleButton-ZsjZg8Nu.js";import{t as O}from"./RichEditBox-DUL777MD.js";import{t as k}from"./ControlExample-BKyw2NwY.js";import{t as A}from"./VariableSizedWrapGrid-rjrhIrGq.js";import{t as j}from"./Rectangle-BEFL2Zt7.js";import{t as M}from"./SplitButton-V_aEWC8I.js";import{t as N}from"./pageState-Djrh7EdY.js";import{t as P}from"./GridView-3JjGgSZX.js";var F=`--- header
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
`,R={__name:`SplitButtonPage`,setup(t,{expose:s}){s();let{t:c}=b(),h=d(`currentPage`),{isFavoriteState:g,pageTheme:_,toggleTheme:v,toggleFavorite:S}=N(h?.value||`splitbutton`),R=l({});e(p,R);let z=f(()=>({PageTitle:c(`text.splitbutton`),Description:c(`text.the-splitbutton-is-a-dropdown-button-but-with-an`),ToggleTheme:c(`gallery.page-header.toggle-theme`),ColorHeader:c(`sample.splitbutton.color-picker`),TextHeader:c(`sample.splitbutton.text`),FontColor:c(`sample.splitbutton.font-color`),FontColorWithText:c(`sample.splitbutton.font-color-with-text`),ChooseColor:c(`sample.choose-color`),Placeholder:c(`sample.type-something-here`),Red:c(`text.red`),Orange:c(`sample.orange`),Yellow:c(`text.yellow`),Green:c(`text.green`),Blue:c(`text.blue`),Indigo:c(`sample.indigo`),Violet:c(`sample.violet`),Gray:c(`sample.gray`),Black:c(`sample.black`)})),B=f(()=>c(g.value?`gallery.remove-favorite`:`gallery.add-favorite`)),V=f(()=>g.value?``:``),H=o(`Green`),U=o(c(`sample.splitbutton.rich-text`)),W=!1,G=(e=!1)=>{if(!W){W=!0;try{let t=R.myRichEditBox;if(!t)return;e&&t.Document.Selection.StartPosition===t.Document.Selection.EndPosition&&t.Document.Selection.SetRange(0,2**53-1),t.Document.Selection.CharacterFormat.ForegroundColor=H.value}finally{W=!1}}},K=async(e,t)=>{let r=t?.ClickedItem,i=r?.Fill??r?.props?.Fill;typeof i==`string`&&(H.value=i,G(),await n(),R.myColorButton?.Flyout?.Hide?.(),R.myRichEditBox?.Focus(`Keyboard`))},q=(e,t)=>{R.myColorButtonReveal?.Flyout?.Hide?.()},J=(e,t)=>G(),Y=(e,t)=>G(!1);i(async()=>{await n(),W=!0;try{let e=R.myRichEditBox;e&&(e.Document.SetText(`None`,U.value),e.Document.GetRange(0,2**53-1).CharacterFormat.ForegroundColor=H.value)}finally{W=!1}});let X=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,Z=X(F),Q=X(I);e(m,{Labels:z,FavoriteLabel:B,FavoriteGlyph:V,isFavoriteState:g,pageTheme:_,toggleTheme:v,toggleFavorite:S,CurrentColorValue:H,EditorText:U,GridView_ItemClick:K,RevealColorButton_Click:q,myColorButton_Click:J,MyRichEditBox_TextChanged:Y,ColorXaml:Z,TextXaml:Q,SplitCSharp:L});let $={t:c,currentPage:h,isFavoriteState:g,pageTheme:_,toggleTheme:v,toggleFavorite:S,Names:R,Labels:z,FavoriteLabel:B,FavoriteGlyph:V,CurrentColorValue:H,EditorText:U,get applyingColor(){return W},set applyingColor(e){W=e},applyColor:G,GridView_ItemClick:K,RevealColorButton_Click:q,myColorButton_Click:J,MyRichEditBox_TextChanged:Y,codePart:X,ColorXaml:Z,TextXaml:Q,computed:f,inject:d,nextTick:n,onMounted:i,provide:e,ref:o,shallowReactive:l,Border:C,Button:w,ControlExample:k,Flyout:T,FontIcon:u,Grid:a,GridView:P,Page:r,Rectangle:j,RichEditBox:O,ScrollViewer:x,SplitButton:M,StackPanel:E,TextBlock:y,ToggleButton:D,VariableSizedWrapGrid:A,get useI18n(){return b},get xamlNameScopeKey(){return p},get xamlScopeKey(){return m},get createPageState(){return N},get colorDefinition(){return F},get textDefinition(){return I},get SplitCSharp(){return L}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}},z={class:`gallery-item-page`},B={class:`page-heading`},V={class:`page-header-actions`};function H(e,n,r,i,a,o){let s=c(`x:Double`),l=c(`ItemsWrapGrid`),u=c(`ItemsPanelTemplate`),d=c(`Setter`),f=c(`Style`);return _(),S(i.Page,null,{default:t(()=>[h(i.Page.Resources,null,{default:t(()=>[h(s,{"x:Key":`SwatchSize`},{default:t(()=>[...n[0]||=[g(`32`,-1)]]),_:1})]),_:1}),h(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[v(`div`,z,[v(`div`,B,[h(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),h(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),v(`div`,V,[h(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[h(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),h(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[h(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),h(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[h(i.ControlExample,{"x:Name":`Example1`,class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonColorPicker.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.ColorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ColorXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:t(()=>[h(i.ControlExample.Example,null,{default:t(()=>[h(i.Grid,{"x:Name":`Control1`,ColumnSpacing:`24`},{default:t(()=>[h(i.SplitButton,{"x:Name":`myColorButton`,MinWidth:`0`,MinHeight:`0`,Padding:`0`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColor, Mode=OneWay}`,Click:`myColorButton_Click`},{default:t(()=>[h(i.Border,{"x:Name":`CurrentColor`,Width:`{StaticResource SwatchSize}`,Height:`{StaticResource SwatchSize}`,Margin:`0`,Background:`{x:Bind CurrentColorValue, Mode=OneWay}`,CornerRadius:`4,0,0,4`}),h(i.SplitButton.Flyout,null,{default:t(()=>[h(i.Flyout,{Placement:`Bottom`},{default:t(()=>[h(i.GridView,{IsItemClickEnabled:`True`,ItemClick:`GridView_ItemClick`},{default:t(()=>[h(i.GridView.ItemsPanel,null,{default:t(()=>[h(u,null,{default:t(()=>[h(l,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`})]),_:1})]),_:1}),h(i.GridView.Resources,null,{default:t(()=>[h(f,{TargetType:`Rectangle`},{default:t(()=>[h(d,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),h(d,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),h(d,{Property:`RadiusX`,Value:`4`}),h(d,{Property:`RadiusY`,Value:`4`})]),_:1})]),_:1}),h(i.GridView.Items,null,{default:t(()=>[h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Fill:`Red`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Fill:`Orange`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Fill:`Yellow`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Fill:`Green`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Fill:`Blue`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Fill:`Indigo`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Fill:`Violet`}),h(i.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Fill:`Gray`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),h(i.ControlExample.Output),h(i.ControlExample.Options,null,{default:t(()=>[h(i.RichEditBox,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,PlaceholderText:`{x:Bind Labels.Placeholder, Mode=OneWay}`,TextChanged:`MyRichEditBox_TextChanged`})]),_:1})]),_:1}),h(i.ControlExample,{class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonText.txt`,HeaderText:`{x:Bind Labels.TextHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TextXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:t(()=>[h(i.ControlExample.Example,null,{default:t(()=>[h(i.SplitButton,{"x:Name":`myColorButtonReveal`,MinWidth:`0`,MinHeight:`0`,Padding:`5`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColorWithText, Mode=OneWay}`,Content:`{x:Bind Labels.ChooseColor, Mode=OneWay}`},{default:t(()=>[h(i.SplitButton.Flyout,null,{default:t(()=>[h(i.Flyout,{Placement:`Bottom`},{default:t(()=>[h(i.VariableSizedWrapGrid,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`},{default:t(()=>[h(i.VariableSizedWrapGrid.Resources,null,{default:t(()=>[h(f,{TargetType:`Rectangle`},{default:t(()=>[h(d,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),h(d,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),h(d,{Property:`RadiusX`,Value:`4`}),h(d,{Property:`RadiusY`,Value:`4`})]),_:1}),h(f,{TargetType:`Button`},{default:t(()=>[h(d,{Property:`Padding`,Value:`0`}),h(d,{Property:`MinWidth`,Value:`0`}),h(d,{Property:`MinHeight`,Value:`0`}),h(d,{Property:`Margin`,Value:`6`}),h(d,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Red`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Orange`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Yellow`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Green`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Blue`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Indigo`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Violet`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Gray`})]),_:1})]),_:1}),h(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.Black, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:t(()=>[h(i.Button.Content,null,{default:t(()=>[h(i.Rectangle,{Fill:`Black`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),h(i.ControlExample.Output),h(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var U=s(R,[[`render`,H],[`__scopeId`,`data-v-518ab18c`],[`__file`,`SplitButtonPage.vue`]]);export{U as default};