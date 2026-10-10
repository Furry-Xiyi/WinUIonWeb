import{Fi as e,I as t,Oi as n,Ti as r,Wi as i,Wt as a,a as ee,ai as o,di as s,et as c,hi as l,o as u,or as d,ri as f,t as te,wi as p}from"./ScrollViewer-PoO_ma9Z.js";import{t as m}from"./Button-DjU0urmJ.js";import{t as h}from"./ComboBox-UT72V9ez.js";import{r as g}from"./inlineControlProperties-DcOtwrbn.js";import{t as _}from"./ContentDialog-CvRQpKVA.js";import{t as v}from"./Rectangle-4smx1ebK.js";import{t as y}from"./StackPanel-CT7pl8zy.js";import{t as ne}from"./ToggleButton-DwmhXZge.js";import{t as re}from"./ControlExample-C1ahTZEr.js";import{t as b}from"./pageState-BN3kXI7L.js";var x=`--- header
A ComboBox with items defined inline and its width set.
--- xaml
<ComboBox SelectionChanged="ColorComboBox_SelectionChanged" Header="Colors" PlaceholderText="Pick a color" Width="200">
    <x:String>Blue</x:String>
    <x:String>Green</x:String>
    <x:String>Red</x:String>
    <x:String>Yellow</x:String>
</ComboBox>`,S=`--- header
A ComboBox with its ItemsSource set.
--- xaml
<ComboBox ItemsSource="{x:Bind Fonts}" DisplayMemberPath="Item1" SelectedValuePath="Item2"
          Header="Font" Width="200" Loaded="Combo2_Loaded"/>`,C=`--- header
An editable ComboBox.
--- xaml
<ComboBox IsEditable="True" ItemsSource="{x:Bind FontSizes}" Width="200" TextSubmitted="Combo3_TextSubmitted"/>`,w=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using System;
using System.Collections.Generic;
using Windows.Foundation.Metadata;

namespace WinUIGallery.ControlPages;

public sealed partial class ComboBoxPage : Page
{
    public List<double> FontSizes { get; } = new List<double>()
        {
            8,
            9,
            10,
            11,
            12,
            14,
            16,
            18,
            20,
            24,
            28,
            36,
            48,
            72
        };

    public ComboBoxPage()
    {
        this.InitializeComponent();
    }

    private void ColorComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        string? colorName = e.AddedItems[0].ToString();
        Windows.UI.Color color;
        switch (colorName)
        {
            case "Yellow":
                color = Colors.Yellow;
                break;
            case "Green":
                color = Colors.Green;
                break;
            case "Blue":
                color = Colors.Blue;
                break;
            case "Red":
                color = Colors.Red;
                break;
            default:
                throw new Exception($"Invalid argument: {colorName}");
        }
        Control1Output.Fill = new SolidColorBrush(color);
    }

    private void Combo3_Loaded(object sender, RoutedEventArgs e)
    {
        Combo3.SelectedIndex = 2;

        if ((ApiInformation.IsApiContractPresent("Windows.Foundation.UniversalApiContract", 7)))
        {
            Combo3.TextSubmitted += Combo3_TextSubmitted;
        }
    }

    private void Combo3_TextSubmitted(ComboBox sender, ComboBoxTextSubmittedEventArgs args)
    {
        bool isDouble = double.TryParse(sender.Text, out double newValue);

        // Set the selected item if:
        // - The value successfully parsed to double AND
        // - The value is in the list of sizes OR is a custom value between 8 and 100
        if (isDouble && (FontSizes.Contains(newValue) || (newValue < 100 && newValue > 8)))
        {
            // Update the SelectedItem to the new value. 
            sender.SelectedItem = newValue;
        }
        else
        {
            // If the item is invalid, reject it and revert the text. 
            sender.Text = sender.SelectedValue.ToString();

            var dialog = new ContentDialog();
            dialog.Content = "The font size must be a number between 8 and 100.";
            dialog.CloseButtonText = "Close";
            dialog.DefaultButton = ContentDialogButton.Close;
            dialog.XamlRoot = sender.XamlRoot;
            _ = dialog.ShowAsync();
        }

        // Mark the event as handled so the framework doesn’t update the selected item automatically. 
        args.Handled = true;
    }
}
`,T=Object.assign({components:{"x:String":g}},{__name:`ComboBoxPage`,setup(e,{expose:n}){n();let{t:a}=c(),o=l(`currentPage`),s=f(()=>o&&o.value?o.value:`combobox`),{isFavoriteState:p,pageTheme:T,toggleTheme:E,toggleFavorite:D}=b(s.value),O=i({});r(d,O);let k=f(()=>a(`text.combobox`)),A=f(()=>a(`text.use-a-combobox-also-known-as-a-drop-down-list-to`)),j=f(()=>a(`gallery.page-header.toggle-theme`)),M=f(()=>a(`gallery.page-header.favorite`)),N=f(()=>p.value?``:``),P=f(()=>a(`sample.combobox.inline`)),F=f(()=>a(`sample.combobox.itemssource`)),I=f(()=>a(`sample.combobox.editable`)),L=f(()=>a(`text.colors`)),R=f(()=>a(`sample.combobox.pick-a-color`)),z=f(()=>a(`sample.combobox.font`)),B=f(()=>a(`sample.combobox.font-size`)),V=f(()=>a(`sample.combobox.font-text`)),H=f(()=>a(`sample.combobox.font-size-text`)),U=f(()=>a(`sample.combobox.invalid-font-size`)),W=f(()=>a(`sample.combobox.close`)),G=(e,t)=>i({get Name(){return a(e)},Font:t}),K={FontHelper:{Fonts:[G(`text.arial`,`Arial`),G(`text.comic-sans-ms`,`Comic Sans MS`),G(`text.courier-new`,`Courier New`),G(`text.segoe-ui`,`Segoe UI`),G(`text.times-new-roman`,`Times New Roman`)]}},q=[8,9,10,11,12,14,16,18,20,24,28,36,48,72],J=(e,t)=>{if(!t.AddedItems||!t.AddedItems.length)return;let n=String(t.AddedItems[0]),r=[[`text.blue`,`Blue`],[`text.green`,`Green`],[`text.red`,`Red`],[`text.yellow`,`Yellow`]].find(([e,t])=>n===a(e)||n===t);r&&O.Control1Output&&(O.Control1Output.Fill=r[1])},Y=e=>{e.SelectedIndex=2},X,Z,ie=e=>{X=e},ae=(e,t)=>{let n=String(e.Text).trim(),r=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(n)?Number(n):NaN;Number.isFinite(r)&&(q.includes(r)||r<100&&r>8)?e.SelectedItem=r:(e.Text=String(e.SelectedValue),X&&!Z&&(Z=X.ShowAsync().finally(()=>{Z=void 0}))),t.Handled=!0},Q=e=>{let t=e.split(/--- xaml\s*\r?\n/);return t.length>1?t[1].trim():``},$={t:a,currentPage:o,pageKey:s,isFavoriteState:p,pageTheme:T,toggleTheme:E,toggleFavorite:D,namescope:O,pageTitle:k,pageDescription:A,themeButtonName:j,favoriteButtonName:M,favoriteGlyph:N,inlineHeader:P,itemsSourceHeader:F,editableHeader:I,colorsHeader:L,colorPlaceholder:R,fontHeader:z,fontSizeHeader:B,fontOutputText:V,fontSizeOutputText:H,invalidFontSizeMessage:U,closeDialogLabel:W,FontItem:G,helper:K,FontSizes:q,ColorComboBox_SelectionChanged:J,Combo3_Loaded:Y,get invalidFontSizeDialog(){return X},set invalidFontSizeDialog(e){X=e},get invalidFontSizeDialogTask(){return Z},set invalidFontSizeDialogTask(e){Z=e},InvalidFontSizeDialog_Loaded:ie,Combo3_TextSubmitted:ae,sampleXaml:Q,inlineXaml:Q(x),itemsSourceXaml:Q(S),editableXaml:Q(C),computed:f,inject:l,provide:r,shallowReactive:i,Button:m,ComboBox:h,get XamlString(){return g},ContentDialog:_,ControlExample:re,FontIcon:ee,Page:t,Rectangle:v,ScrollViewer:te,StackPanel:y,TextBlock:u,ToggleButton:ne,get useI18n(){return c},get xamlNameScopeKey(){return d},get createPageState(){return b},get inlineSample(){return x},get itemsSourceSample(){return S},get editableSample(){return C},get comboBoxCSharp(){return w}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function E(t,r,i,a,ee,c){let l=n(`x:String`),u=n(`DataTemplate`);return p(),o(a.Page,{"xmlns:helper":`using:WinUIGallery.Helpers`},{default:e(()=>[s(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[s(a.StackPanel,{class:`gallery-item-page`},{default:e(()=>[s(a.StackPanel,{class:`page-heading`},{default:e(()=>[s(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),s(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),s(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[s(a.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeButtonName, Mode=OneWay}`,Click:`toggleTheme`},{default:e(()=>[s(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),s(a.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:e(()=>[s(a.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),s(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[s(a.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxInline.txt`,HeaderText:`{x:Bind inlineHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind inlineXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:e(()=>[s(a.ControlExample.Example,null,{default:e(()=>[s(a.StackPanel,{class:`combobox-sample`},{default:e(()=>[s(a.ComboBox,{"x:Name":`Combo1`,Width:`200`,Header:`{x:Bind colorsHeader, Mode=OneWay}`,PlaceholderText:`{x:Bind colorPlaceholder, Mode=OneWay}`,SelectionChanged:`ColorComboBox_SelectionChanged`},{default:e(()=>[s(l,{"x:Uid":`text.blue`}),s(l,{"x:Uid":`text.green`}),s(l,{"x:Uid":`text.red`}),s(l,{"x:Uid":`text.yellow`})]),_:1}),s(a.Rectangle,{"x:Name":`Control1Output`,Width:`100`,Height:`30`,Margin:`0,8,0,0`})]),_:1})]),_:1}),s(a.ControlExample.Output),s(a.ControlExample.Options)]),_:1}),s(a.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxItemsSource.txt`,HeaderText:`{x:Bind itemsSourceHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind itemsSourceXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:e(()=>[s(a.ControlExample.Example,null,{default:e(()=>[s(a.StackPanel,{class:`combobox-sample`},{default:e(()=>[s(a.ComboBox,{"x:Name":`Combo2`,MinWidth:`200`,Header:`{x:Bind fontHeader, Mode=OneWay}`,SelectedIndex:`2`,ItemsSource:`{x:Bind helper:FontHelper.Fonts}`},{default:e(()=>[s(a.ComboBox.ItemTemplate,null,{default:e(()=>[s(u,{"x:DataType":`helper:FontItem`},{default:e(()=>[s(a.TextBlock,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),s(a.TextBlock,{"x:Name":`Control2Output`,FontFamily:`{x:Bind ((helper:FontItem)Combo2.SelectedItem).Font, Mode=OneWay}`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind fontOutputText, Mode=OneWay}`})]),_:1})]),_:1}),s(a.ControlExample.Output),s(a.ControlExample.Options)]),_:1}),s(a.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxEditable.txt`,HeaderText:`{x:Bind editableHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind editableXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:e(()=>[s(a.ControlExample.Example,null,{default:e(()=>[s(a.StackPanel,{class:`combobox-sample`},{default:e(()=>[s(a.ComboBox,{"x:Name":`Combo3`,Width:`200`,Header:`{x:Bind fontSizeHeader, Mode=OneWay}`,IsEditable:`True`,ItemsSource:`{x:Bind FontSizes}`,Loaded:`Combo3_Loaded`,TextSubmitted:`Combo3_TextSubmitted`}),s(a.TextBlock,{"x:Name":`Control3Output`,FontFamily:`Segoe UI`,FontSize:`{x:Bind (x:Double)Combo3.SelectedValue, Mode=OneWay}`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind fontSizeOutputText, Mode=OneWay}`})]),_:1})]),_:1}),s(a.ControlExample.Output),s(a.ControlExample.Options)]),_:1}),s(a.ContentDialog,{Loaded:`InvalidFontSizeDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Content:`{x:Bind invalidFontSizeMessage, Mode=OneWay}`,CloseButtonText:`{x:Bind closeDialogLabel, Mode=OneWay}`,DefaultButton:`Close`})]),_:1})]),_:1})]),_:1})]),_:1})}var D=a(T,[[`render`,E],[`__scopeId`,`data-v-6c99b01d`],[`__file`,`ComboBoxPage.vue`]]);export{D as default};