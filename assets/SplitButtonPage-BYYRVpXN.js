import{Fi as e,I as t,Lt as n,Oi as r,Ti as i,Ui as a,Wi as o,Wt as s,a as c,ai as l,di as u,et as d,hi as f,ii as p,o as m,or as h,ri as g,sr as _,t as v,ui as y,vi as b,wi as x,xi as S}from"./ScrollViewer-PoO_ma9Z.js";import{n as C}from"./ContentPresenter-NCdCdNyK.js";import{t as w}from"./Button-DjU0urmJ.js";import{t as T}from"./Flyout-DRW8XITi.js";import{t as E}from"./Rectangle-4smx1ebK.js";import{t as D}from"./GridView-BZFBsHA0.js";import{t as O}from"./StackPanel-CT7pl8zy.js";import{t as k}from"./RichEditBox-BLzc5ui_.js";import{t as A}from"./SplitButton-5pYIekpg.js";import{t as j}from"./ToggleButton-DwmhXZge.js";import{t as M}from"./VariableSizedWrapGrid-D86umqqu.js";import{t as N}from"./ControlExample-C1ahTZEr.js";import{t as P}from"./pageState-BN3kXI7L.js";var F=`--- header
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
`,R={__name:`SplitButtonPage`,setup(e,{expose:r}){r();let{t:s}=d(),l=f(`currentPage`),{isFavoriteState:u,pageTheme:p,toggleTheme:y,toggleFavorite:x}=P(l?.value||`splitbutton`),R=o({});i(h,R);let z=g(()=>({PageTitle:s(`text.splitbutton`),Description:s(`text.the-splitbutton-is-a-dropdown-button-but-with-an`),ToggleTheme:s(`gallery.page-header.toggle-theme`),ColorHeader:s(`sample.splitbutton.color-picker`),TextHeader:s(`sample.splitbutton.text`),FontColor:s(`sample.splitbutton.font-color`),FontColorWithText:s(`sample.splitbutton.font-color-with-text`),ChooseColor:s(`sample.choose-color`),Placeholder:s(`sample.type-something-here`),Red:s(`text.red`),Orange:s(`sample.orange`),Yellow:s(`text.yellow`),Green:s(`text.green`),Blue:s(`text.blue`),Indigo:s(`sample.indigo`),Violet:s(`sample.violet`),Gray:s(`sample.gray`),Black:s(`sample.black`)})),B=g(()=>s(u.value?`gallery.remove-favorite`:`gallery.add-favorite`)),V=g(()=>u.value?``:``),H=a(`Green`),U=a(s(`sample.splitbutton.rich-text`)),W=!1,G=(e=!1)=>{if(!W){W=!0;try{let t=R.myRichEditBox;if(!t)return;e&&t.Document.Selection.StartPosition===t.Document.Selection.EndPosition&&t.Document.Selection.SetRange(0,2**53-1),t.Document.Selection.CharacterFormat.ForegroundColor=H.value}finally{W=!1}}},K=async(e,t)=>{let n=t?.ClickedItem,r=n?.Fill??n?.props?.Fill;typeof r==`string`&&(H.value=r,G(),await b(),R.myColorButton?.Flyout?.Hide?.(),R.myRichEditBox?.Focus(`Keyboard`))},q=(e,t)=>{R.myColorButtonReveal?.Flyout?.Hide?.()},J=(e,t)=>G(),Y=(e,t)=>G(!1);S(async()=>{await b(),W=!0;try{let e=R.myRichEditBox;e&&(e.Document.SetText(`None`,U.value),e.Document.GetRange(0,2**53-1).CharacterFormat.ForegroundColor=H.value)}finally{W=!1}});let X=e=>e.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,Z=X(F),Q=X(I);i(_,{Labels:z,FavoriteLabel:B,FavoriteGlyph:V,isFavoriteState:u,pageTheme:p,toggleTheme:y,toggleFavorite:x,CurrentColorValue:H,EditorText:U,GridView_ItemClick:K,RevealColorButton_Click:q,myColorButton_Click:J,MyRichEditBox_TextChanged:Y,ColorXaml:Z,TextXaml:Q,SplitCSharp:L});let $={t:s,currentPage:l,isFavoriteState:u,pageTheme:p,toggleTheme:y,toggleFavorite:x,Names:R,Labels:z,FavoriteLabel:B,FavoriteGlyph:V,CurrentColorValue:H,EditorText:U,get applyingColor(){return W},set applyingColor(e){W=e},applyColor:G,GridView_ItemClick:K,RevealColorButton_Click:q,myColorButton_Click:J,MyRichEditBox_TextChanged:Y,codePart:X,ColorXaml:Z,TextXaml:Q,computed:g,inject:f,nextTick:b,onMounted:S,provide:i,ref:a,shallowReactive:o,Border:C,Button:w,ControlExample:N,Flyout:T,FontIcon:c,Grid:n,GridView:D,Page:t,Rectangle:E,RichEditBox:k,ScrollViewer:v,SplitButton:A,StackPanel:O,TextBlock:m,ToggleButton:j,VariableSizedWrapGrid:M,get useI18n(){return d},get xamlNameScopeKey(){return h},get xamlScopeKey(){return _},get createPageState(){return P},get colorDefinition(){return F},get textDefinition(){return I},get SplitCSharp(){return L}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}},z={class:`gallery-item-page`},B={class:`page-heading`},V={class:`page-header-actions`};function H(t,n,i,a,o,s){let c=r(`x:Double`),d=r(`ItemsWrapGrid`),f=r(`ItemsPanelTemplate`),m=r(`Setter`),h=r(`Style`);return x(),l(a.Page,null,{default:e(()=>[u(a.Page.Resources,null,{default:e(()=>[u(c,{"x:Key":`SwatchSize`},{default:e(()=>[...n[0]||=[y(`32`,-1)]]),_:1})]),_:1}),u(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[p(`div`,z,[p(`div`,B,[u(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),u(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,V,[u(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[u(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),u(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[u(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),u(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[u(a.ControlExample,{"x:Name":`Example1`,class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonColorPicker.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.ColorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ColorXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.Grid,{"x:Name":`Control1`,ColumnSpacing:`24`},{default:e(()=>[u(a.SplitButton,{"x:Name":`myColorButton`,MinWidth:`0`,MinHeight:`0`,Padding:`0`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColor, Mode=OneWay}`,Click:`myColorButton_Click`},{default:e(()=>[u(a.Border,{"x:Name":`CurrentColor`,Width:`{StaticResource SwatchSize}`,Height:`{StaticResource SwatchSize}`,Margin:`0`,Background:`{x:Bind CurrentColorValue, Mode=OneWay}`,CornerRadius:`4,0,0,4`}),u(a.SplitButton.Flyout,null,{default:e(()=>[u(a.Flyout,{Placement:`Bottom`},{default:e(()=>[u(a.GridView,{IsItemClickEnabled:`True`,ItemClick:`GridView_ItemClick`},{default:e(()=>[u(a.GridView.ItemsPanel,null,{default:e(()=>[u(f,null,{default:e(()=>[u(d,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`})]),_:1})]),_:1}),u(a.GridView.Resources,null,{default:e(()=>[u(h,{TargetType:`Rectangle`},{default:e(()=>[u(m,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),u(m,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),u(m,{Property:`RadiusX`,Value:`4`}),u(m,{Property:`RadiusY`,Value:`4`})]),_:1})]),_:1}),u(a.GridView.Items,null,{default:e(()=>[u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Fill:`Red`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Fill:`Orange`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Fill:`Yellow`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Fill:`Green`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Fill:`Blue`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Fill:`Indigo`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Fill:`Violet`}),u(a.Rectangle,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Fill:`Gray`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output),u(a.ControlExample.Options,null,{default:e(()=>[u(a.RichEditBox,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,PlaceholderText:`{x:Bind Labels.Placeholder, Mode=OneWay}`,TextChanged:`MyRichEditBox_TextChanged`})]),_:1})]),_:1}),u(a.ControlExample,{class:`split-example`,SampleDefinition:`SplitButton\\SplitButtonText.txt`,HeaderText:`{x:Bind Labels.TextHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind TextXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:e(()=>[u(a.ControlExample.Example,null,{default:e(()=>[u(a.SplitButton,{"x:Name":`myColorButtonReveal`,MinWidth:`0`,MinHeight:`0`,Padding:`5`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind Labels.FontColorWithText, Mode=OneWay}`,Content:`{x:Bind Labels.ChooseColor, Mode=OneWay}`},{default:e(()=>[u(a.SplitButton.Flyout,null,{default:e(()=>[u(a.Flyout,{Placement:`Bottom`},{default:e(()=>[u(a.VariableSizedWrapGrid,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`},{default:e(()=>[u(a.VariableSizedWrapGrid.Resources,null,{default:e(()=>[u(h,{TargetType:`Rectangle`},{default:e(()=>[u(m,{Property:`Width`,Value:`{StaticResource SwatchSize}`}),u(m,{Property:`Height`,Value:`{StaticResource SwatchSize}`}),u(m,{Property:`RadiusX`,Value:`4`}),u(m,{Property:`RadiusY`,Value:`4`})]),_:1}),u(h,{TargetType:`Button`},{default:e(()=>[u(m,{Property:`Padding`,Value:`0`}),u(m,{Property:`MinWidth`,Value:`0`}),u(m,{Property:`MinHeight`,Value:`0`}),u(m,{Property:`Margin`,Value:`6`}),u(m,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Red, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Red`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Orange, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Orange`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Yellow, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Yellow`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Green, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Green`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Blue, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Blue`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Indigo, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Indigo`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Violet, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Violet`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Gray, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Gray`})]),_:1})]),_:1}),u(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.Black, Mode=OneWay}`,Click:`RevealColorButton_Click`},{default:e(()=>[u(a.Button.Content,null,{default:e(()=>[u(a.Rectangle,{Fill:`Black`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(a.ControlExample.Output),u(a.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var U=s(R,[[`render`,H],[`__scopeId`,`data-v-518ab18c`],[`__file`,`SplitButtonPage.vue`]]);export{U as default};