import{$ as e,Ai as t,Bi as n,Ci as r,Ji as i,Mn as a,Ni as o,Yi as s,a as c,bi as l,ci as u,dr as d,fr as f,gi as p,ki as m,li as h,o as g,p as _,t as v,ui as y}from"./ScrollViewer-CHNE18MA.js";import{t as b}from"./Button-DO0TiUOq.js";import{t as x}from"./Flyout-8D4iwnYI.js";import{t as S}from"./StackPanel-C60XOD66.js";import{t as C}from"./ToggleButton-ZsjZg8Nu.js";import{t as w}from"./RichEditBox-DUL777MD.js";import{t as T}from"./ControlExample-BKyw2NwY.js";import{t as E}from"./ToggleSplitButton-ChxEdqPa.js";import{t as D}from"./pageState-Djrh7EdY.js";var O=`--- header
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
`,A={__name:`ToggleSplitButtonPage`,setup(n,{expose:a}){a();let{t:o}=_(),p=l(`currentPage`),{isFavoriteState:m,pageTheme:h,toggleTheme:y,toggleFavorite:A}=D(p?.value||`togglesplitbutton`),j=s({});t(d,j);let M=u(()=>({PageTitle:o(`text.togglesplitbutton`),Description:o(`text.a-button-that-can-be-toggled-on-off-with-additio`),ToggleTheme:o(`gallery.page-header.toggle-theme`),BulletListHeader:o(`sample.togglesplitbutton.bullet-list`),BulletedList:o(`sample.togglesplitbutton.bulleted-list`),RomanNumeralsList:o(`sample.togglesplitbutton.roman-numerals-list`),TextEntry:o(`sample.togglesplitbutton.text-entry`)})),N=u(()=>o(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=u(()=>m.value?``:``),F=i(!1),I=i(`List`),L=u(()=>o(I.value===`List`?`sample.togglesplitbutton.bullets`:`sample.togglesplitbutton.roman-numerals`)),R=async e=>{await r();let t=j.myRichEditBox;t&&(t.Document.Selection.ParagraphFormat.ListType=e?I.value===`List`?`Bullet`:`UpperRoman`:`None`,t.Focus(`Keyboard`))},z=async(e,t)=>{let n=e?.Content,r=n?.Symbol??n?.props?.Symbol;r!==`List`&&r!==`Bullets`||(I.value=r,F.value=!0,await R(!0),j.myListButton?.Flyout?.Hide?.(),j.myRichEditBox?.Focus(`Keyboard`))},B=(e,t)=>{F.value=!!e?.IsChecked,R(F.value)},V=(`--- header
Using ToggleSplitButton to control bulleted list functionality in RichEditBox
--- xaml
<ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" Click="myListButton_Click">
    <SymbolIcon x:Name="mySymbolIcon" Symbol="List"/>
    <ToggleSplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </ToggleSplitButton.Flyout>
</ToggleSplitButton>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`Click="myListButton_Click"`,`IsCheckedChanged="MyListButton_IsCheckedChanged"`);t(f,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:m,pageTheme:h,toggleTheme:y,toggleFavorite:A,IsListChecked:F,ListSymbol:I,ListAutomationName:L,BulletButton_Click:z,MyListButton_IsCheckedChanged:B,ToggleSplitXaml:V,ToggleSplitCSharp:k});let H={t:o,currentPage:p,isFavoriteState:m,pageTheme:h,toggleTheme:y,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,IsListChecked:F,ListSymbol:I,ListAutomationName:L,applyListState:R,BulletButton_Click:z,MyListButton_IsCheckedChanged:B,ToggleSplitXaml:V,computed:u,inject:l,nextTick:r,provide:t,ref:i,shallowReactive:s,Button:b,ControlExample:T,Flyout:x,FontIcon:c,RichEditBox:w,ScrollViewer:v,StackPanel:S,SymbolIcon:e,TextBlock:g,ToggleButton:C,ToggleSplitButton:E,get useI18n(){return _},get xamlNameScopeKey(){return d},get xamlScopeKey(){return f},get createPageState(){return D},get toggleSplitDefinition(){return O},get ToggleSplitCSharp(){return k}};return Object.defineProperty(H,"__isScriptSetup",{enumerable:!1,value:!0}),H}},j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(e,t,r,i,a,s){let c=o(`Setter`),l=o(`Style`);return m(),y(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[h(`div`,j,[h(`div`,M,[p(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),p(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),h(`div`,N,[p(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[p(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),p(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[p(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),p(i.StackPanel,{class:`gallery-page-content`},{default:n(()=>[p(i.ControlExample,{"x:Name":`Example1`,class:`toggle-split-example`,SampleDefinition:`ToggleSplitButton\\ToggleSplitButtonBulletList.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.BulletListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleSplitXaml}`,CSharp:`{x:Bind ToggleSplitCSharp}`},{default:n(()=>[p(i.ControlExample.Example,null,{default:n(()=>[p(i.ToggleSplitButton,{"x:Name":`myListButton`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind ListAutomationName, Mode=OneWay}`,IsChecked:`{x:Bind IsListChecked, Mode=TwoWay}`,IsCheckedChanged:`MyListButton_IsCheckedChanged`},{default:n(()=>[p(i.SymbolIcon,{"x:Name":`mySymbolIcon`,Symbol:`{x:Bind ListSymbol, Mode=OneWay}`}),p(i.ToggleSplitButton.Flyout,null,{default:n(()=>[p(i.Flyout,{Placement:`Bottom`},{default:n(()=>[p(i.StackPanel,{Orientation:`Horizontal`},{default:n(()=>[p(i.StackPanel.Resources,null,{default:n(()=>[p(l,{TargetType:`Button`},{default:n(()=>[p(c,{Property:`Padding`,Value:`4`}),p(c,{Property:`MinWidth`,Value:`0`}),p(c,{Property:`MinHeight`,Value:`0`}),p(c,{Property:`Margin`,Value:`6`}),p(c,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),p(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.BulletedList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:n(()=>[p(i.SymbolIcon,{Symbol:`List`})]),_:1}),p(i.Button,{"AutomationProperties.Name":`{x:Bind Labels.RomanNumeralsList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:n(()=>[p(i.SymbolIcon,{Symbol:`Bullets`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(i.ControlExample.Output),p(i.ControlExample.Options,null,{default:n(()=>[p(i.RichEditBox,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,"AutomationProperties.Name":`{x:Bind Labels.TextEntry, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})])]),_:1})}var F=a(A,[[`render`,P],[`__scopeId`,`data-v-d70860b9`],[`__file`,`ToggleSplitButtonPage.vue`]]);export{F as default};