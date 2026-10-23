import{Ai as e,Di as t,Ei as n,I as r,Ki as i,Li as a,Wt as o,_i as s,a as c,ai as l,et as u,o as ee,pi as d,si as f,sr as p,t as m}from"./ScrollViewer-BWDA_C78.js";import{t as te}from"./Button-BNDPNdYJ.js";import{t as ne}from"./ComboBox-c_LaT8fC.js";import{r as h}from"./inlineControlProperties-CBoqGJWv.js";import{t as g}from"./ContentDialog-CoLzvISE.js";import{t as _}from"./Rectangle-BObi0TNt.js";import{t as v}from"./StackPanel-sg_Bd5oB.js";import{t as y}from"./ToggleButton-HP5wmrvH.js";import{t as b}from"./ControlExample-CzGyf8u0.js";import{t as x}from"./pageState-CcJibQcm.js";var S=`--- header
A ComboBox with items defined inline and its width set.
--- xaml
<ComboBox SelectionChanged="ColorComboBox_SelectionChanged" Header="Colors" PlaceholderText="Pick a color" Width="200">
    <x:String>Blue</x:String>
    <x:String>Green</x:String>
    <x:String>Red</x:String>
    <x:String>Yellow</x:String>
</ComboBox>`,C=`--- header
A ComboBox with its ItemsSource set.
--- xaml
<ComboBox ItemsSource="{x:Bind Fonts}" DisplayMemberPath="Item1" SelectedValuePath="Item2"
          Header="Font" Width="200" Loaded="Combo2_Loaded"/>`,w=`--- header
An editable ComboBox.
--- xaml
<ComboBox IsEditable="True" ItemsSource="{x:Bind FontSizes}" Width="200" TextSubmitted="Combo3_TextSubmitted"/>`,re=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,T=Object.assign({components:{"x:String":h}},{__name:`ComboBoxPage`,setup(e,{expose:n}){n();let{t:a}=u(),o=s(`currentPage`),d=l(()=>o&&o.value?o.value:`combobox`),{isFavoriteState:f,pageTheme:T,toggleTheme:E,toggleFavorite:D}=x(d.value),O=i({});t(p,O);let k=l(()=>a(`text.combobox`)),A=l(()=>a(`text.use-a-combobox-also-known-as-a-drop-down-list-to`)),j=l(()=>a(`gallery.page-header.toggle-theme`)),M=l(()=>a(`gallery.page-header.favorite`)),N=l(()=>f.value?``:``),P=l(()=>a(`sample.combobox.inline`)),F=l(()=>a(`sample.combobox.itemssource`)),I=l(()=>a(`sample.combobox.editable`)),L=l(()=>a(`text.colors`)),R=l(()=>a(`sample.combobox.pick-a-color`)),z=l(()=>a(`sample.combobox.font`)),B=l(()=>a(`sample.combobox.font-size`)),V=l(()=>a(`sample.combobox.font-text`)),H=l(()=>a(`sample.combobox.font-size-text`)),U=l(()=>a(`sample.combobox.invalid-font-size`)),W=l(()=>a(`sample.combobox.close`)),G=(e,t)=>i({get Name(){return a(e)},Font:t}),K={FontHelper:{Fonts:[G(`text.arial`,`Arial`),G(`text.comic-sans-ms`,`Comic Sans MS`),G(`text.courier-new`,`Courier New`),G(`text.segoe-ui`,`Segoe UI`),G(`text.times-new-roman`,`Times New Roman`)]}},q=[8,9,10,11,12,14,16,18,20,24,28,36,48,72],J=(e,t)=>{if(!t.AddedItems||!t.AddedItems.length)return;let n=String(t.AddedItems[0]),r=[[`text.blue`,`Blue`],[`text.green`,`Green`],[`text.red`,`Red`],[`text.yellow`,`Yellow`]].find(([e,t])=>n===a(e)||n===t);r&&O.Control1Output&&(O.Control1Output.Fill=r[1])},Y=e=>{e.SelectedIndex=2},X,Z,ie=e=>{X=e},ae=(e,t)=>{let n=String(e.Text).trim(),r=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(n)?Number(n):NaN;Number.isFinite(r)&&(q.includes(r)||r<100&&r>8)?e.SelectedItem=r:(e.Text=String(e.SelectedValue),X&&!Z&&(Z=X.ShowAsync().finally(()=>{Z=void 0}))),t.Handled=!0},Q=e=>{let t=e.split(/--- xaml\s*\r?\n/);return t.length>1?t[1].trim():``},$={t:a,currentPage:o,pageKey:d,isFavoriteState:f,pageTheme:T,toggleTheme:E,toggleFavorite:D,namescope:O,pageTitle:k,pageDescription:A,themeButtonName:j,favoriteButtonName:M,favoriteGlyph:N,inlineHeader:P,itemsSourceHeader:F,editableHeader:I,colorsHeader:L,colorPlaceholder:R,fontHeader:z,fontSizeHeader:B,fontOutputText:V,fontSizeOutputText:H,invalidFontSizeMessage:U,closeDialogLabel:W,FontItem:G,helper:K,FontSizes:q,ColorComboBox_SelectionChanged:J,Combo3_Loaded:Y,get invalidFontSizeDialog(){return X},set invalidFontSizeDialog(e){X=e},get invalidFontSizeDialogTask(){return Z},set invalidFontSizeDialogTask(e){Z=e},InvalidFontSizeDialog_Loaded:ie,Combo3_TextSubmitted:ae,sampleXaml:Q,inlineXaml:Q(S),itemsSourceXaml:Q(C),editableXaml:Q(w),computed:l,inject:s,provide:t,shallowReactive:i,Button:te,ComboBox:ne,get XamlString(){return h},ContentDialog:g,ControlExample:b,FontIcon:c,Page:r,Rectangle:_,ScrollViewer:m,StackPanel:v,TextBlock:ee,ToggleButton:y,get useI18n(){return u},get xamlNameScopeKey(){return p},get createPageState(){return x},get inlineSample(){return S},get itemsSourceSample(){return C},get editableSample(){return w},get comboBoxCSharp(){return re}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function E(t,r,i,o,s,c){let l=e(`x:String`),u=e(`DataTemplate`);return n(),f(o.Page,{"xmlns:helper":`using:WinUIGallery.Helpers`},{default:a(()=>[d(o.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[d(o.StackPanel,{class:`gallery-item-page`},{default:a(()=>[d(o.StackPanel,{class:`page-heading`},{default:a(()=>[d(o.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(o.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(o.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:a(()=>[d(o.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeButtonName, Mode=OneWay}`,Click:`toggleTheme`},{default:a(()=>[d(o.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(o.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:a(()=>[d(o.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),d(o.StackPanel,{class:`gallery-page-content`},{default:a(()=>[d(o.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxInline.txt`,HeaderText:`{x:Bind inlineHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind inlineXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:a(()=>[d(o.ControlExample.Example,null,{default:a(()=>[d(o.StackPanel,{class:`combobox-sample`},{default:a(()=>[d(o.ComboBox,{"x:Name":`Combo1`,Width:`200`,Header:`{x:Bind colorsHeader, Mode=OneWay}`,PlaceholderText:`{x:Bind colorPlaceholder, Mode=OneWay}`,SelectionChanged:`ColorComboBox_SelectionChanged`},{default:a(()=>[d(l,{"x:Uid":`text.blue`}),d(l,{"x:Uid":`text.green`}),d(l,{"x:Uid":`text.red`}),d(l,{"x:Uid":`text.yellow`})]),_:1}),d(o.Rectangle,{"x:Name":`Control1Output`,Width:`100`,Height:`30`,Margin:`0,8,0,0`})]),_:1})]),_:1}),d(o.ControlExample.Output),d(o.ControlExample.Options)]),_:1}),d(o.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxItemsSource.txt`,HeaderText:`{x:Bind itemsSourceHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind itemsSourceXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:a(()=>[d(o.ControlExample.Example,null,{default:a(()=>[d(o.StackPanel,{class:`combobox-sample`},{default:a(()=>[d(o.ComboBox,{"x:Name":`Combo2`,MinWidth:`200`,Header:`{x:Bind fontHeader, Mode=OneWay}`,SelectedIndex:`2`,ItemsSource:`{x:Bind helper:FontHelper.Fonts}`},{default:a(()=>[d(o.ComboBox.ItemTemplate,null,{default:a(()=>[d(u,{"x:DataType":`helper:FontItem`},{default:a(()=>[d(o.TextBlock,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),d(o.TextBlock,{"x:Name":`Control2Output`,FontFamily:`{x:Bind ((helper:FontItem)Combo2.SelectedItem).Font, Mode=OneWay}`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind fontOutputText, Mode=OneWay}`})]),_:1})]),_:1}),d(o.ControlExample.Output),d(o.ControlExample.Options)]),_:1}),d(o.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxEditable.txt`,HeaderText:`{x:Bind editableHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind editableXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:a(()=>[d(o.ControlExample.Example,null,{default:a(()=>[d(o.StackPanel,{class:`combobox-sample`},{default:a(()=>[d(o.ComboBox,{"x:Name":`Combo3`,Width:`200`,Header:`{x:Bind fontSizeHeader, Mode=OneWay}`,IsEditable:`True`,ItemsSource:`{x:Bind FontSizes}`,Loaded:`Combo3_Loaded`,TextSubmitted:`Combo3_TextSubmitted`}),d(o.TextBlock,{"x:Name":`Control3Output`,FontFamily:`Segoe UI`,FontSize:`{x:Bind (x:Double)Combo3.SelectedValue, Mode=OneWay}`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind fontSizeOutputText, Mode=OneWay}`})]),_:1})]),_:1}),d(o.ControlExample.Output),d(o.ControlExample.Options)]),_:1}),d(o.ContentDialog,{Loaded:`InvalidFontSizeDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Content:`{x:Bind invalidFontSizeMessage, Mode=OneWay}`,CloseButtonText:`{x:Bind closeDialogLabel, Mode=OneWay}`,DefaultButton:`Close`})]),_:1})]),_:1})]),_:1})]),_:1})}var D=o(T,[[`render`,E],[`__scopeId`,`data-v-6c99b01d`],[`__file`,`ComboBoxPage.vue`]]);export{D as default};