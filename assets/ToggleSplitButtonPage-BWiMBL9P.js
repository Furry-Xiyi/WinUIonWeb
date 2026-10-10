import{$ as e,Ai as t,Bi as n,Ci as r,Ji as i,Mn as a,Ni as o,Yi as s,a as c,bi as l,ci as u,dr as d,fr as f,gi as p,ki as m,li as h,o as g,p as _,t as v,ui as y}from"./ScrollViewer-DXAtwYnH.js";import{t as b}from"./Button-1Ztf3pH0.js";import{t as x}from"./Flyout-Bb2H7-cQ.js";import{t as S}from"./StackPanel-DGz4UnE4.js";import{t as C}from"./ToggleButton-D0RGNdIP.js";import{t as w}from"./RichEditBox-w4uvD6xN.js";import{t as T}from"./ControlExample-BX-yRpiQ.js";import{t as E}from"./ToggleSplitButton-B0o2FjP7.js";import{t as D}from"./pageState-cPponcIo.js";var O=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,k={class:`gallery-item-page`},A={class:`page-heading`},j={class:`page-header-actions`},M=a({__name:`ToggleSplitButtonPage`,setup(a){let{t:M}=_(),{isFavoriteState:N,pageTheme:P,toggleTheme:F,toggleFavorite:I}=D(l(`currentPage`)?.value||`togglesplitbutton`),L=s({});t(d,L);let R=u(()=>({PageTitle:M(`text.togglesplitbutton`),Description:M(`text.a-button-that-can-be-toggled-on-off-with-additio`),ToggleTheme:M(`gallery.page-header.toggle-theme`),BulletListHeader:M(`sample.togglesplitbutton.bullet-list`),BulletedList:M(`sample.togglesplitbutton.bulleted-list`),RomanNumeralsList:M(`sample.togglesplitbutton.roman-numerals-list`),TextEntry:M(`sample.togglesplitbutton.text-entry`)})),z=u(()=>M(N.value?`gallery.remove-favorite`:`gallery.add-favorite`)),B=u(()=>N.value?``:``),V=i(!1),H=i(`List`),U=u(()=>M(H.value===`List`?`sample.togglesplitbutton.bullets`:`sample.togglesplitbutton.roman-numerals`)),W=async e=>{await r();let t=L.myRichEditBox;t&&(t.Document.Selection.ParagraphFormat.ListType=e?H.value===`List`?`Bullet`:`UpperRoman`:`None`,t.Focus(`Keyboard`))};return t(f,{Labels:R,FavoriteLabel:z,FavoriteGlyph:B,isFavoriteState:N,pageTheme:P,toggleTheme:F,toggleFavorite:I,IsListChecked:V,ListSymbol:H,ListAutomationName:U,BulletButton_Click:async(e,t)=>{let n=e?.Content,r=n?.Symbol??n?.props?.Symbol;r!==`List`&&r!==`Bullets`||(H.value=r,V.value=!0,await W(!0),L.myListButton?.Flyout?.Hide?.(),L.myRichEditBox?.Focus(`Keyboard`))},MyListButton_IsCheckedChanged:(e,t)=>{V.value=!!e?.IsChecked,W(V.value)},ToggleSplitXaml:(`--- header
Using ToggleSplitButton to control bulleted list functionality in RichEditBox
--- xaml
<ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" Click="myListButton_Click">
    <SymbolIcon x:Name="mySymbolIcon" Symbol="List"/>
    <ToggleSplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </ToggleSplitButton.Flyout>
</ToggleSplitButton>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`Click="myListButton_Click"`,`IsCheckedChanged="MyListButton_IsCheckedChanged"`),ToggleSplitCSharp:O}),(t,r)=>{let i=o(`Setter`),a=o(`Style`);return m(),y(v,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[h(`div`,k,[h(`div`,A,[p(g,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),p(g,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),h(`div`,j,[p(b,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[p(c,{Glyph:``,FontSize:`16`})]),_:1}),p(C,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[p(c,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),p(S,{class:`gallery-page-content`},{default:n(()=>[p(T,{"x:Name":`Example1`,class:`toggle-split-example`,SampleDefinition:`ToggleSplitButton\\ToggleSplitButtonBulletList.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.BulletListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleSplitXaml}`,CSharp:`{x:Bind ToggleSplitCSharp}`},{default:n(()=>[p(T.Example,null,{default:n(()=>[p(E,{"x:Name":`myListButton`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind ListAutomationName, Mode=OneWay}`,IsChecked:`{x:Bind IsListChecked, Mode=TwoWay}`,IsCheckedChanged:`MyListButton_IsCheckedChanged`},{default:n(()=>[p(e,{"x:Name":`mySymbolIcon`,Symbol:`{x:Bind ListSymbol, Mode=OneWay}`}),p(E.Flyout,null,{default:n(()=>[p(x,{Placement:`Bottom`},{default:n(()=>[p(S,{Orientation:`Horizontal`},{default:n(()=>[p(S.Resources,null,{default:n(()=>[p(a,{TargetType:`Button`},{default:n(()=>[p(i,{Property:`Padding`,Value:`4`}),p(i,{Property:`MinWidth`,Value:`0`}),p(i,{Property:`MinHeight`,Value:`0`}),p(i,{Property:`Margin`,Value:`6`}),p(i,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),p(b,{"AutomationProperties.Name":`{x:Bind Labels.BulletedList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:n(()=>[p(e,{Symbol:`List`})]),_:1}),p(b,{"AutomationProperties.Name":`{x:Bind Labels.RomanNumeralsList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:n(()=>[p(e,{Symbol:`Bullets`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output),p(T.Options,null,{default:n(()=>[p(w,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,"AutomationProperties.Name":`{x:Bind Labels.TextEntry, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})])]),_:1})}}},[[`__scopeId`,`data-v-d70860b9`]]);export{M as default};