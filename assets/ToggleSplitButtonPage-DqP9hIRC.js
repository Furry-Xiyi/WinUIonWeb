import{Ai as e,Di as t,Ei as n,Gi as r,Ki as i,Li as a,Nt as o,Wt as s,_i as c,a as l,ai as u,bi as d,cr as f,et as p,o as m,oi as h,pi as g,si as _,sr as v,t as y}from"./ScrollViewer-BWDA_C78.js";import{t as b}from"./Button-BNDPNdYJ.js";import{t as x}from"./Flyout-C3sOZyEQ.js";import{t as S}from"./StackPanel-sg_Bd5oB.js";import{t as C}from"./RichEditBox-56YTK8rU.js";import{t as w}from"./ToggleButton-HP5wmrvH.js";import{t as T}from"./ToggleSplitButton-hfs6Hp3A.js";import{t as E}from"./ControlExample-CzGyf8u0.js";import{t as D}from"./pageState-CcJibQcm.js";var O=`--- header
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
`,A={__name:`ToggleSplitButtonPage`,setup(e,{expose:n}){n();let{t:a}=p(),s=c(`currentPage`),{isFavoriteState:h,pageTheme:g,toggleTheme:_,toggleFavorite:A}=D(s?.value||`togglesplitbutton`),j=i({});t(v,j);let M=u(()=>({PageTitle:a(`text.togglesplitbutton`),Description:a(`text.a-button-that-can-be-toggled-on-off-with-additio`),ToggleTheme:a(`gallery.page-header.toggle-theme`),BulletListHeader:a(`sample.togglesplitbutton.bullet-list`),BulletedList:a(`sample.togglesplitbutton.bulleted-list`),RomanNumeralsList:a(`sample.togglesplitbutton.roman-numerals-list`),TextEntry:a(`sample.togglesplitbutton.text-entry`)})),N=u(()=>a(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=u(()=>h.value?``:``),F=r(!1),I=r(`List`),L=u(()=>a(I.value===`List`?`sample.togglesplitbutton.bullets`:`sample.togglesplitbutton.roman-numerals`)),R=async e=>{await d();let t=j.myRichEditBox;t&&(t.Document.Selection.ParagraphFormat.ListType=e?I.value===`List`?`Bullet`:`UpperRoman`:`None`,t.Focus(`Keyboard`))},z=async(e,t)=>{let n=e?.Content,r=n?.Symbol??n?.props?.Symbol;r!==`List`&&r!==`Bullets`||(I.value=r,F.value=!0,await R(!0),j.myListButton?.Flyout?.Hide?.(),j.myRichEditBox?.Focus(`Keyboard`))},B=(e,t)=>{F.value=!!e?.IsChecked,R(F.value)},V=(`--- header
Using ToggleSplitButton to control bulleted list functionality in RichEditBox
--- xaml
<ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" Click="myListButton_Click">
    <SymbolIcon x:Name="mySymbolIcon" Symbol="List"/>
    <ToggleSplitButton.Flyout>
        <Flyout Placement="Bottom">
            <!-- flyout content -->
        </Flyout>
    </ToggleSplitButton.Flyout>
</ToggleSplitButton>`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``).replace(`Click="myListButton_Click"`,`IsCheckedChanged="MyListButton_IsCheckedChanged"`);t(f,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:h,pageTheme:g,toggleTheme:_,toggleFavorite:A,IsListChecked:F,ListSymbol:I,ListAutomationName:L,BulletButton_Click:z,MyListButton_IsCheckedChanged:B,ToggleSplitXaml:V,ToggleSplitCSharp:k});let H={t:a,currentPage:s,isFavoriteState:h,pageTheme:g,toggleTheme:_,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,IsListChecked:F,ListSymbol:I,ListAutomationName:L,applyListState:R,BulletButton_Click:z,MyListButton_IsCheckedChanged:B,ToggleSplitXaml:V,computed:u,inject:c,nextTick:d,provide:t,ref:r,shallowReactive:i,Button:b,ControlExample:E,Flyout:x,FontIcon:l,RichEditBox:C,ScrollViewer:y,StackPanel:S,SymbolIcon:o,TextBlock:m,ToggleButton:w,ToggleSplitButton:T,get useI18n(){return p},get xamlNameScopeKey(){return v},get xamlScopeKey(){return f},get createPageState(){return D},get toggleSplitDefinition(){return O},get ToggleSplitCSharp(){return k}};return Object.defineProperty(H,"__isScriptSetup",{enumerable:!1,value:!0}),H}},j={class:`gallery-item-page`},M={class:`page-heading`},N={class:`page-header-actions`};function P(t,r,i,o,s,c){let l=e(`Setter`),u=e(`Style`);return n(),_(o.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[h(`div`,j,[h(`div`,M,[g(o.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),g(o.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),h(`div`,N,[g(o.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[g(o.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),g(o.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[g(o.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),g(o.StackPanel,{class:`gallery-page-content`},{default:a(()=>[g(o.ControlExample,{"x:Name":`Example1`,class:`toggle-split-example`,SampleDefinition:`ToggleSplitButton\\ToggleSplitButtonBulletList.txt`,WebViewHeight:`150`,HeaderText:`{x:Bind Labels.BulletListHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleSplitXaml}`,CSharp:`{x:Bind ToggleSplitCSharp}`},{default:a(()=>[g(o.ControlExample.Example,null,{default:a(()=>[g(o.ToggleSplitButton,{"x:Name":`myListButton`,VerticalAlignment:`Top`,"AutomationProperties.Name":`{x:Bind ListAutomationName, Mode=OneWay}`,IsChecked:`{x:Bind IsListChecked, Mode=TwoWay}`,IsCheckedChanged:`MyListButton_IsCheckedChanged`},{default:a(()=>[g(o.SymbolIcon,{"x:Name":`mySymbolIcon`,Symbol:`{x:Bind ListSymbol, Mode=OneWay}`}),g(o.ToggleSplitButton.Flyout,null,{default:a(()=>[g(o.Flyout,{Placement:`Bottom`},{default:a(()=>[g(o.StackPanel,{Orientation:`Horizontal`},{default:a(()=>[g(o.StackPanel.Resources,null,{default:a(()=>[g(u,{TargetType:`Button`},{default:a(()=>[g(l,{Property:`Padding`,Value:`4`}),g(l,{Property:`MinWidth`,Value:`0`}),g(l,{Property:`MinHeight`,Value:`0`}),g(l,{Property:`Margin`,Value:`6`}),g(l,{Property:`CornerRadius`,Value:`{StaticResource ControlCornerRadius}`})]),_:1})]),_:1}),g(o.Button,{"AutomationProperties.Name":`{x:Bind Labels.BulletedList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:a(()=>[g(o.SymbolIcon,{Symbol:`List`})]),_:1}),g(o.Button,{"AutomationProperties.Name":`{x:Bind Labels.RomanNumeralsList, Mode=OneWay}`,Click:`BulletButton_Click`},{default:a(()=>[g(o.SymbolIcon,{Symbol:`Bullets`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),g(o.ControlExample.Output),g(o.ControlExample.Options,null,{default:a(()=>[g(o.RichEditBox,{"x:Name":`myRichEditBox`,class:`sample-editor`,Width:`240`,MinHeight:`96`,"AutomationProperties.Name":`{x:Bind Labels.TextEntry, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})])]),_:1})}var F=s(A,[[`render`,P],[`__scopeId`,`data-v-d70860b9`],[`__file`,`ToggleSplitButtonPage.vue`]]);export{F as default};