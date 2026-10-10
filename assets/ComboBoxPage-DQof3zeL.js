import{Ai as e,Bi as t,Cn as n,Mn as r,Ni as i,Yi as a,a as o,bi as s,ci as c,dr as l,gi as u,ki as d,o as ee,p as f,t as te,ui as p}from"./ScrollViewer-CHNE18MA.js";import{t as ne}from"./Button-DO0TiUOq.js";import{t as m}from"./StackPanel-C60XOD66.js";import{t as h}from"./ToggleButton-ZsjZg8Nu.js";import{t as re}from"./ComboBox-CjdqaKdN.js";import{r as g}from"./inlineControlProperties-k1PUSjJA.js";import{t as _}from"./ControlExample-BKyw2NwY.js";import{t as v}from"./Rectangle-BEFL2Zt7.js";import{t as y}from"./ContentDialog-Ba5PjGm3.js";import{t as b}from"./pageState-Djrh7EdY.js";var x=`--- header
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
`,T=Object.assign({components:{"x:String":g}},{__name:`ComboBoxPage`,setup(t,{expose:r}){r();let{t:i}=f(),u=s(`currentPage`),d=c(()=>u&&u.value?u.value:`combobox`),{isFavoriteState:p,pageTheme:T,toggleTheme:E,toggleFavorite:D}=b(d.value),O=a({});e(l,O);let k=c(()=>i(`text.combobox`)),A=c(()=>i(`text.use-a-combobox-also-known-as-a-drop-down-list-to`)),j=c(()=>i(`gallery.page-header.toggle-theme`)),M=c(()=>i(`gallery.page-header.favorite`)),N=c(()=>p.value?``:``),P=c(()=>i(`sample.combobox.inline`)),F=c(()=>i(`sample.combobox.itemssource`)),I=c(()=>i(`sample.combobox.editable`)),L=c(()=>i(`text.colors`)),R=c(()=>i(`sample.combobox.pick-a-color`)),z=c(()=>i(`sample.combobox.font`)),B=c(()=>i(`sample.combobox.font-size`)),V=c(()=>i(`sample.combobox.font-text`)),H=c(()=>i(`sample.combobox.font-size-text`)),U=c(()=>i(`sample.combobox.invalid-font-size`)),W=c(()=>i(`sample.combobox.close`)),G=(e,t)=>a({get Name(){return i(e)},Font:t}),K={FontHelper:{Fonts:[G(`text.arial`,`Arial`),G(`text.comic-sans-ms`,`Comic Sans MS`),G(`text.courier-new`,`Courier New`),G(`text.segoe-ui`,`Segoe UI`),G(`text.times-new-roman`,`Times New Roman`)]}},q=[8,9,10,11,12,14,16,18,20,24,28,36,48,72],J=(e,t)=>{if(!t.AddedItems||!t.AddedItems.length)return;let n=String(t.AddedItems[0]),r=[[`text.blue`,`Blue`],[`text.green`,`Green`],[`text.red`,`Red`],[`text.yellow`,`Yellow`]].find(([e,t])=>n===i(e)||n===t);r&&O.Control1Output&&(O.Control1Output.Fill=r[1])},Y=e=>{e.SelectedIndex=2},X,Z,ie=e=>{X=e},ae=(e,t)=>{let n=String(e.Text).trim(),r=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(n)?Number(n):NaN;Number.isFinite(r)&&(q.includes(r)||r<100&&r>8)?e.SelectedItem=r:(e.Text=String(e.SelectedValue),X&&!Z&&(Z=X.ShowAsync().finally(()=>{Z=void 0}))),t.Handled=!0},Q=e=>{let t=e.split(/--- xaml\s*\r?\n/);return t.length>1?t[1].trim():``},$={t:i,currentPage:u,pageKey:d,isFavoriteState:p,pageTheme:T,toggleTheme:E,toggleFavorite:D,namescope:O,pageTitle:k,pageDescription:A,themeButtonName:j,favoriteButtonName:M,favoriteGlyph:N,inlineHeader:P,itemsSourceHeader:F,editableHeader:I,colorsHeader:L,colorPlaceholder:R,fontHeader:z,fontSizeHeader:B,fontOutputText:V,fontSizeOutputText:H,invalidFontSizeMessage:U,closeDialogLabel:W,FontItem:G,helper:K,FontSizes:q,ColorComboBox_SelectionChanged:J,Combo3_Loaded:Y,get invalidFontSizeDialog(){return X},set invalidFontSizeDialog(e){X=e},get invalidFontSizeDialogTask(){return Z},set invalidFontSizeDialogTask(e){Z=e},InvalidFontSizeDialog_Loaded:ie,Combo3_TextSubmitted:ae,sampleXaml:Q,inlineXaml:Q(x),itemsSourceXaml:Q(S),editableXaml:Q(C),computed:c,inject:s,provide:e,shallowReactive:a,Button:ne,ComboBox:re,get XamlString(){return g},ContentDialog:y,ControlExample:_,FontIcon:o,Page:n,Rectangle:v,ScrollViewer:te,StackPanel:m,TextBlock:ee,ToggleButton:h,get useI18n(){return f},get xamlNameScopeKey(){return l},get createPageState(){return b},get inlineSample(){return x},get itemsSourceSample(){return S},get editableSample(){return C},get comboBoxCSharp(){return w}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function E(e,n,r,a,o,s){let c=i(`x:String`),l=i(`DataTemplate`);return d(),p(a.Page,{"xmlns:helper":`using:WinUIGallery.Helpers`},{default:t(()=>[u(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(a.StackPanel,{class:`gallery-item-page`},{default:t(()=>[u(a.StackPanel,{class:`page-heading`},{default:t(()=>[u(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),u(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(a.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeButtonName, Mode=OneWay}`,Click:`toggleTheme`},{default:t(()=>[u(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),u(a.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:t(()=>[u(a.FontIcon,{Glyph:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),u(a.StackPanel,{class:`gallery-page-content`},{default:t(()=>[u(a.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxInline.txt`,HeaderText:`{x:Bind inlineHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind inlineXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:t(()=>[u(a.ControlExample.Example,null,{default:t(()=>[u(a.StackPanel,{class:`combobox-sample`},{default:t(()=>[u(a.ComboBox,{"x:Name":`Combo1`,Width:`200`,Header:`{x:Bind colorsHeader, Mode=OneWay}`,PlaceholderText:`{x:Bind colorPlaceholder, Mode=OneWay}`,SelectionChanged:`ColorComboBox_SelectionChanged`},{default:t(()=>[u(c,{"x:Uid":`text.blue`}),u(c,{"x:Uid":`text.green`}),u(c,{"x:Uid":`text.red`}),u(c,{"x:Uid":`text.yellow`})]),_:1}),u(a.Rectangle,{"x:Name":`Control1Output`,Width:`100`,Height:`30`,Margin:`0,8,0,0`})]),_:1})]),_:1}),u(a.ControlExample.Output),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxItemsSource.txt`,HeaderText:`{x:Bind itemsSourceHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind itemsSourceXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:t(()=>[u(a.ControlExample.Example,null,{default:t(()=>[u(a.StackPanel,{class:`combobox-sample`},{default:t(()=>[u(a.ComboBox,{"x:Name":`Combo2`,MinWidth:`200`,Header:`{x:Bind fontHeader, Mode=OneWay}`,SelectedIndex:`2`,ItemsSource:`{x:Bind helper:FontHelper.Fonts}`},{default:t(()=>[u(a.ComboBox.ItemTemplate,null,{default:t(()=>[u(l,{"x:DataType":`helper:FontItem`},{default:t(()=>[u(a.TextBlock,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),u(a.TextBlock,{"x:Name":`Control2Output`,FontFamily:`{x:Bind ((helper:FontItem)Combo2.SelectedItem).Font, Mode=OneWay}`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind fontOutputText, Mode=OneWay}`})]),_:1})]),_:1}),u(a.ControlExample.Output),u(a.ControlExample.Options)]),_:1}),u(a.ControlExample,{class:`combobox-example`,SampleDefinition:`ComboBox\\ComboBoxEditable.txt`,HeaderText:`{x:Bind editableHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind editableXaml, Mode=OneWay}`,CSharp:`{x:Bind comboBoxCSharp, Mode=OneWay}`},{default:t(()=>[u(a.ControlExample.Example,null,{default:t(()=>[u(a.StackPanel,{class:`combobox-sample`},{default:t(()=>[u(a.ComboBox,{"x:Name":`Combo3`,Width:`200`,Header:`{x:Bind fontSizeHeader, Mode=OneWay}`,IsEditable:`True`,ItemsSource:`{x:Bind FontSizes}`,Loaded:`Combo3_Loaded`,TextSubmitted:`Combo3_TextSubmitted`}),u(a.TextBlock,{"x:Name":`Control3Output`,FontFamily:`Segoe UI`,FontSize:`{x:Bind (x:Double)Combo3.SelectedValue, Mode=OneWay}`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind fontSizeOutputText, Mode=OneWay}`})]),_:1})]),_:1}),u(a.ControlExample.Output),u(a.ControlExample.Options)]),_:1}),u(a.ContentDialog,{Loaded:`InvalidFontSizeDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Content:`{x:Bind invalidFontSizeMessage, Mode=OneWay}`,CloseButtonText:`{x:Bind closeDialogLabel, Mode=OneWay}`,DefaultButton:`Close`})]),_:1})]),_:1})]),_:1})]),_:1})}var D=r(T,[[`render`,E],[`__scopeId`,`data-v-6c99b01d`],[`__file`,`ComboBoxPage.vue`]]);export{D as default};