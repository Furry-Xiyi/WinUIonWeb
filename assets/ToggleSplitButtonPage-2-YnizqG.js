import{Fi as e,Nt as t,Oi as n,Ti as r,Ui as i,Wi as a,Wt as o,a as s,ai as c,di as l,et as u,hi as d,ii as f,o as p,or as m,ri as h,sr as g,t as _,vi as v,wi as y}from"./ScrollViewer-PoO_ma9Z.js";import{t as b}from"./Button-DjU0urmJ.js";import{t as x}from"./Flyout-DRW8XITi.js";import{t as S}from"./StackPanel-CT7pl8zy.js";import{t as C}from"./RichEditBox-BLzc5ui_.js";import{t as w}from"./ToggleButton-DwmhXZge.js";import{t as T}from"./ToggleSplitButton-gSIw_B5-.js";import{t as E}from"./ControlExample-C1ahTZEr.js";import{t as D}from"./pageState-BN3kXI7L.js";var O=`--- header
Using ToggleSplitButton to control bulleted list functionality in RichEditBox
--- xaml
<ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" Click="myListButton_Click">
    <SymbolIcon x:Name="mySymbolIcon" Symbol="List"/>
    <ToggleSplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </ToggleSplitButton.Flyout>
</ToggleSplitButton>`,k=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Text;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class ToggleSplitButtonPage : Page
{
    private MarkerType _type = MarkerType.Bullet;
    public ToggleSplitButtonPage()
    {
        this.InitializeComponent();
    }

    private void BulletButton_Click(object sender, RoutedEventArgs e)
    {
        Button clickedBullet = (Button)sender;
        SymbolIcon symbol = (SymbolIcon)clickedBullet.Content;

        if (symbol.Symbol == Symbol.List)
        {
            _type = MarkerType.Bullet;
            mySymbolIcon.Symbol = Symbol.List;
            myListButton.SetValue(AutomationProperties.NameProperty, "Bullets");
        }
        else if (symbol.Symbol == Symbol.Bullets)
        {
            _type = MarkerType.UppercaseRoman;
            mySymbolIcon.Symbol = Symbol.Bullets;
            myListButton.SetValue(AutomationProperties.NameProperty, "Roman Numerals");
        }
        myRichEditBox.Document.Selection.ParagraphFormat.ListType = _type;

        myListButton.IsChecked = true;
        myListButton.Flyout.Hide();
        myRichEditBox.Focus(FocusState.Keyboard);
    }

    private void MyListButton_IsCheckedChanged(Microsoft.UI.Xaml.Controls.ToggleSplitButton sender, Microsoft.UI.Xaml.Controls.ToggleSplitButtonIsCheckedChangedEventArgs args)
    {
        if (sender.IsChecked)
        {
            //add bulleted list
            myRichEditBox.Document.Selection.ParagraphFormat.ListType = _type;
        }
        else
        {
            //remove bulleted list
            myRichEditBox.Document.Selection.ParagraphFormat.ListType = MarkerType.None;
        }
    }
}
`,A={__name:`ToggleSplitButtonPage`,setup(e,{expose:n}){n();let{t:o}=u(),c=d(`currentPage`),{isFavoriteState:l,pageTheme:f,toggleTheme:y,toggleFavorite:A}=D(c?.value||`togglesplitbutton`),j=a({});r(m,j);let M=h(()=>({PageTitle:o(`text.togglesplitbutton`),Description:o(`text.a-button-that-can-be-toggled-on-off-with-additio`),ToggleTheme:o(`gallery.page-header.toggle-theme`),BulletListHeader:o(`sample.togglesplitbutton.bullet-list`),BulletedList:o(`sample.togglesplitbutton.bulleted-list`),RomanNumeralsList:o(`sample.togglesplitbutton.roman-numerals-list`),TextEntry:o(`sample.togglesplitbutton.text-entry`)})),N=h(()=>o(l.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=h(()=>l.value?``:``),F=i(!1),I=i(`List`),L=h(()=>o(I.value===`List`?`sample.togglesplitbutton.bullets`:`sample.togglesplitbutton.roman-numerals`)),R=async e=>{await v();let t=j.myRichEditBox;t&&(t.Document.Selection.ParagraphFormat.ListType=e?I.value===`List`?`Bullet`:`UpperRoman`:`None`,t.Focus(`Keyboard`))},z=async(e,t)=>{let n=e?.Content,r=n?.Symbol??n?.props?.Symbol;r!==`List`&&r!==`Bullets`||(I.value=r,F.value=!0,await R(!0),j.myListButton?.Flyout?.Hide?.(),j.myRichEditBox?.Focus(`Keyboard`))},B=(e,t)=>{F.value=!!e?.IsChecked,R(F.value)},V=(`--- header
Using ToggleSplitButton to control bulleted list functionality in RichEditBox
--- xaml
<ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" Click="myListButton_Click">
    <SymbolIcon x:Name="mySymbolIcon" Symbol="List"/>
    <ToggleSplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </ToggleSplitButton.Flyout>
</ToggleSplitButton>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`Click="myListButton_Click"`,`IsCheckedChanged="MyListButton_IsCheckedChanged"`);r(g,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:l,pageTheme:f,toggleTheme:y,toggleFavorite:A,IsListChecked:F,ListSymbol:I,ListAutomationName:L,BulletButton_Click:z,MyListButton_IsCheckedChanged:B,ToggleSplitXaml:V,ToggleSplitCSharp:k});let H={t:o,currentPage:c,isFavoriteState:l,pageTheme:f,toggleTheme:y,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,IsListChecked:F,ListSymbol:I,ListAutomationName:L,applyListState:R,BulletButton_Click:z,MyListButton_IsCheckedChanged:B,ToggleSplitXaml:V,computed:h,inject:d,nextTick:v,provide:r,ref:i,shallowReactive:a,Button:b,ControlExample:E,Flyout:x,FontIcon:s,RichEditBox:C,ScrollViewer:_,StackPanel:S,SymbolIcon:t,TextBlock:p,ToggleButton:w,ToggleSplitButton:T,get useI18n(){return u},get xamlNameScopeKey(){return m},get xamlScopeKey(){return g},get createPageState(){return D},get toggleSplitDefinition(){return O},get ToggleSplitCSharp(){return k}};return Object.defineProperty(H,"__isScriptSetup",{enumerable:!1,value:!0}),H}},j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(t,r,i,a,o,s){let u=n(`Setter`),d=n(`Style`);return y(),c(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[f(`div`,j,[f(`div`,M,[l(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),l(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(`div`,N,[l(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[l(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),l(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[l(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),l(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[l(a.ControlExample,{"x:Name":`Example1`,class:`toggle-split-example`,SampleDefinition:`ToggleSplitButton\\ToggleSplitButtonBulletList.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.BulletListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleSplitXaml}`,CSharp:`{x:Bind ToggleSplitCSharp}`},{default:e(()=>[l(a.ControlExample.Example,null,{default:e(()=>[l(a.ToggleSplitButton,{"x:Name":`myListButton`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind ListAutomationName, Mode=OneWay}`,IsChecked:`{x:Bind IsListChecked, Mode=TwoWay}`,IsCheckedChanged:`MyListButton_IsCheckedChanged`},{default:e(()=>[l(a.SymbolIcon,{"x:Name":`mySymbolIcon`,Symbol:`{x:Bind ListSymbol, Mode=OneWay}`}),l(a.ToggleSplitButton.Flyout,null,{default:e(()=>[l(a.Flyout,{Placement:`Bottom`},{default:e(()=>[l(a.StackPanel,{Orientation:`Horizontal`},{default:e(()=>[l(a.StackPanel.Resources,null,{default:e(()=>[l(d,{TargetType:`Button`},{default:e(()=>[l(u,{Property:`Padding`,Value:`4`}),l(u,{Property:`MinWidth`,Value:`0`}),l(u,{Property:`MinHeight`,Value:`0`}),l(u,{Property:`Margin`,Value:`6`}),l(u,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),l(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.BulletedList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:e(()=>[l(a.SymbolIcon,{Symbol:`List`})]),_:1}),l(a.Button,{"AutomationProperties.Name":`{x:Bind Labels.RomanNumeralsList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:e(()=>[l(a.SymbolIcon,{Symbol:`Bullets`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),l(a.ControlExample.Output),l(a.ControlExample.Options,null,{default:e(()=>[l(a.RichEditBox,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,"AutomationProperties.Name":`{x:Bind Labels.TextEntry, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})])]),_:1})}var F=o(A,[[`render`,P],[`__scopeId`,`data-v-d70860b9`],[`__file`,`ToggleSplitButtonPage.vue`]]);export{F as default};