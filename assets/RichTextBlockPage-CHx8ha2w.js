import{Ci as e,Cn as t,Di as n,Ei as r,I as i,Ki as a,Li as o,Lt as s,Mn as c,On as l,Wt as u,_i as d,a as f,ai as p,bi as m,cr as h,et as g,o as _,pi as v,si as y,sr as b,t as x}from"./ScrollViewer-BWDA_C78.js";import{t as S}from"./Button-BNDPNdYJ.js";import{s as C}from"./ItemsView-CDH66l7e.js";import{t as w}from"./ComboBox-c_LaT8fC.js";import{t as T}from"./inlineControlProperties-CBoqGJWv.js";import{t as E}from"./StackPanel-sg_Bd5oB.js";import{t as D}from"./RichTextBlock-BCLxH7DW.js";import{t as O}from"./RichTextBlockOverflow-dVF5KY6d.js";import{t as k}from"./ToggleButton-HP5wmrvH.js";import{t as A}from"./ControlExample-CzGyf8u0.js";import{t as j}from"./pageState-CcJibQcm.js";var M=`--- header
A simple RichTextBlock.
--- xaml
<RichTextBlock>
    <Paragraph>I am a RichTextBlock.</Paragraph>
</RichTextBlock>`,N=`--- header
A RichTextBlock with a custom selection highlight color.
--- xaml
<RichTextBlock SelectionHighlightColor="Green">
    <Paragraph>RichTextBlock provides a rich text display container that supports
        <Run FontStyle="Italic" FontWeight="Bold">formatted text</Run>,
        <Hyperlink NavigateUri="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink">hyperlinks</Hyperlink>, inline images, and other rich content.</Paragraph>
    <Paragraph>RichTextBlock also supports a built-in overflow model.</Paragraph>
</RichTextBlock>`,P=`--- header
A RichTextBlock with overflow.
--- xaml
<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition/>
        <ColumnDefinition/>
        <ColumnDefinition/>
    <Grid.ColumnDefinitions>
    <RichTextBlock Grid.Column="0" OverflowContentTarget="{x:Bind firstOverflowContainer}" TextAlignment="Justify" Margin="12,0">
        <Paragraph>
            Linked text containers allow text which does not fit in one element to overflow into a different element on the page.
            Creative use of linked text containers enables basic multicolumn support and other advanced page layouts.
        </Paragraph>
    <!-- Additional content not shown. -->
    </RichTextBlock>
    <RichTextBlockOverflow x:Name="firstOverflowContainer" OverflowContentTarget="{x:Bind secondOverflowContainer}" Grid.Column="1" Margin="12,0"/>
    <RichTextBlockOverflow x:Name="secondOverflowContainer" Grid.Column="2" Margin="12,0"/>
</Grid>`,F=`--- header
RichTextBlock with custom TextHighlighting
--- xaml
<RichTextBlock x:Name="TextHighlightingRichTextBlock">
    <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
    </Paragraph>
</RichTextBlock>
--- c#
private void HighlightColorCombobox_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    // Get color to use
    var selectedItem = (sender as ComboBox).SelectedItem as ComboBoxItem;
    var color = Colors.Yellow;
    switch (selectedItem.Content as string)
    {
        case "Yellow":
            color = Colors.Yellow;
            break;
        case "Red":
            color = Colors.Red;
            break;
        case "Blue":
            color = Colors.Blue;
            break;
    }

    // Get text range and highlighter
    TextRange textRange = new TextRange()
    {
        StartIndex = 28,
        Length = 11
    };
    TextHighlighter highlighter = new TextHighlighter()
    {
        Background = new SolidColorBrush(color),
        Ranges = { textRange }
    };

    // Switch texthighlighter
    TextHighlightingRichTextBlock.TextHighlighters.Clear();
    TextHighlightingRichTextBlock.TextHighlighters.Add(highlighter);
}`,I={__name:`RichTextBlockPage`,setup(r,{expose:o}){o();let{t:u}=g(),v=d(`currentPage`),{isFavoriteState:y,pageTheme:I,toggleTheme:L,toggleFavorite:R}=j(v?.value||`richtextblock`),z=a({});n(b,z);let B=p(()=>({Title:u(`text.richtextblock`),Description:u(`sample.richtextblock.description`),ToggleTheme:u(`gallery.page-header.toggle-theme`),Header0:u(`sample.richtextblock.simple`),Text4:u(`sample.richtextblock.simple-text`),Header1:u(`sample.richtextblock.selection-highlight`),Text6:u(`sample.richtextblock.rich-container-supports`),Text7:u(`sample.richtextblock.formatted-text`),Text8:u(`TextControls.RichTextBlock.Label1`),Text9:u(`sample.richtextblock.hyperlinks`),Text10:u(`TextControls.RichTextBlock.Label2`),Text11:u(`sample.richtextblock.overflow-support`),Header2:u(`sample.richtextblock.overflow`),Text13:u(`sample.richtextblock.overflow-paragraph`),Text14:u(`TextControls.RichTextBlock.Label3`),Text15:u(`TextControls.RichTextBlock.Label4`),Text16:u(`TextControls.RichTextBlock.Label5`),Header3:u(`sample.richtextblock.custom-highlighting`),Text18:u(`TextControls.RichTextBlock.Label6`),Text19:u(`sample.richtextblock.highlighting-color`),Text20:u(`text.yellow`),Text21:u(`text.red`),Text22:u(`text.blue`)})),V=p(()=>u(y.value?`gallery.remove-favorite`:`gallery.add-favorite`)),H=p(()=>y.value?``:``),U=[M,N,P,F].map(e=>({Xaml:e.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim()??``,CSharp:e.split(/^--- c#\r?\n/m)[1]?.trim()??``}));U[2].Xaml=U[2].Xaml.replace(/(<ColumnDefinition\/>\s*)<Grid\.ColumnDefinitions>/,`$1</Grid.ColumnDefinitions>`);let W=`Yellow`,G=()=>{let e=z.TextHighlightingRichTextBlock?.TextHighlighters;e&&(e.Clear(),e.Add({Background:W,Ranges:[{StartIndex:28,Length:11}]}))},K=e=>{W=[`Yellow`,`Red`,`Blue`][e.SelectedIndex]??`Yellow`,G()};e(async()=>{await m(),G()}),n(h,{Labels:B,FavoriteLabel:V,FavoriteGlyph:H,isFavoriteState:y,pageTheme:I,Sources:U,toggleTheme:L,toggleFavorite:R,HighlightColorCombobox_SelectionChanged:K});let q={t:u,currentPage:v,isFavoriteState:y,pageTheme:I,toggleTheme:L,toggleFavorite:R,controls:z,Labels:B,FavoriteLabel:V,FavoriteGlyph:H,Sources:U,get selectedHighlightColor(){return W},set selectedHighlightColor(e){W=e},applyHighlight:G,HighlightColorCombobox_SelectionChanged:K,computed:p,inject:d,nextTick:m,onMounted:e,provide:n,shallowReactive:a,Button:S,ToggleButton:k,FontIcon:f,ControlExample:A,Page:i,ScrollViewer:x,StackPanel:E,Grid:s,ColumnDefinition:C,TextBlock:_,RichTextBlock:D,ComboBox:w,RichTextBlockOverflow:O,get Run(){return c},get Hyperlink(){return t},get Paragraph(){return l},ComboBoxItem:T,get xamlNameScopeKey(){return b},get xamlScopeKey(){return h},get useI18n(){return g},get createPageState(){return j},get Sample0(){return M},get Sample1(){return N},get Sample2(){return P},get Sample3(){return F}};return Object.defineProperty(q,"__isScriptSetup",{enumerable:!1,value:!0}),q}};function L(e,t,n,i,a,s){return r(),y(i.Page,null,{default:o(()=>[v(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:o(()=>[v(i.StackPanel,{class:`gallery-item-page`},{default:o(()=>[v(i.StackPanel,{class:`page-heading`},{default:o(()=>[v(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`}),v(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),v(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:o(()=>[v(i.Button,{Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:o(()=>[v(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),v(i.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:o(()=>[v(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),v(i.StackPanel,{class:`gallery-page-content`},{default:o(()=>[v(i.StackPanel,null,{default:o(()=>[v(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`RichTextBlock\\SimpleRichtextblock.txt`,HeaderText:`{x:Bind Labels.Header0, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[0].Xaml}`,CSharp:`{x:Bind Sources[0].CSharp}`},{default:o(()=>[v(i.ControlExample.Example,null,{default:o(()=>[v(i.RichTextBlock,null,{default:o(()=>[v(i.Paragraph,null,{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text4, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),v(i.ControlExample.Output),v(i.ControlExample.Options)]),_:1}),v(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`RichTextBlock\\RichtextblockCustomSelectionHighlight.txt`,HeaderText:`{x:Bind Labels.Header1, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[1].Xaml}`,CSharp:`{x:Bind Sources[1].CSharp}`},{default:o(()=>[v(i.ControlExample.Example,null,{default:o(()=>[v(i.RichTextBlock,{SelectionHighlightColor:`Green`},{default:o(()=>[v(i.Paragraph,null,{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text6, Mode=OneWay}`}),v(i.Run,{FontStyle:`Italic`,FontWeight:`Bold`,Text:`{x:Bind Labels.Text7, Mode=OneWay}`}),v(i.Run,{Text:`{x:Bind Labels.Text8, Mode=OneWay}`}),v(i.Hyperlink,{NavigateUri:`https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink`},{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text9, Mode=OneWay}`})]),_:1}),v(i.Run,{Text:`{x:Bind Labels.Text10, Mode=OneWay}`})]),_:1}),v(i.Paragraph,null,{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text11, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),v(i.ControlExample.Output),v(i.ControlExample.Options)]),_:1}),v(i.ControlExample,{"x:Name":`Example3`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichTextBlock\\RichtextblockOverflow.txt`,HeaderText:`{x:Bind Labels.Header2, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[2].Xaml}`,CSharp:`{x:Bind Sources[2].CSharp}`},{default:o(()=>[v(i.ControlExample.Example,null,{default:o(()=>[v(i.Grid,{Height:`300`},{default:o(()=>[v(i.Grid.ColumnDefinitions,null,{default:o(()=>[v(i.ColumnDefinition),v(i.ColumnDefinition),v(i.ColumnDefinition)]),_:1}),v(i.RichTextBlock,{"Grid.Column":`0`,Margin:`12,0`,OverflowContentTarget:`{x:Bind firstOverflowContainer}`,TextAlignment:`Justify`},{default:o(()=>[v(i.Paragraph,null,{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text13, Mode=OneWay}`})]),_:1}),v(i.Paragraph,null,{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text14, Mode=OneWay}`})]),_:1})]),_:1}),v(i.RichTextBlockOverflow,{"x:Name":`firstOverflowContainer`,"Grid.Column":`1`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text15, Mode=OneWay}`,OverflowContentTarget:`{x:Bind secondOverflowContainer}`}),v(i.RichTextBlockOverflow,{"x:Name":`secondOverflowContainer`,"Grid.Column":`2`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text16, Mode=OneWay}`})]),_:1})]),_:1}),v(i.ControlExample.Output),v(i.ControlExample.Options)]),_:1}),v(i.ControlExample,{SampleDefinition:`RichTextBlock\\RichtextblockCustomTexthighlighting.txt`,HeaderText:`{x:Bind Labels.Header3, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[3].Xaml}`,CSharp:`{x:Bind Sources[3].CSharp}`},{default:o(()=>[v(i.ControlExample.Example,null,{default:o(()=>[v(i.RichTextBlock,{"x:Name":`TextHighlightingRichTextBlock`},{default:o(()=>[v(i.Paragraph,null,{default:o(()=>[v(i.Run,{Text:`{x:Bind Labels.Text18, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),v(i.ControlExample.Output),v(i.ControlExample.Options,null,{default:o(()=>[v(i.StackPanel,null,{default:o(()=>[v(i.ComboBox,{Header:`{x:Bind Labels.Text19, Mode=OneWay}`,SelectionChanged:`HighlightColorCombobox_SelectionChanged`},{default:o(()=>[v(i.ComboBoxItem,{Content:`{x:Bind Labels.Text20, Mode=OneWay}`,IsSelected:`True`}),v(i.ComboBoxItem,{Content:`{x:Bind Labels.Text21, Mode=OneWay}`}),v(i.ComboBoxItem,{Content:`{x:Bind Labels.Text22, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var R=u(I,[[`render`,L],[`__scopeId`,`data-v-0d35c88f`],[`__file`,`RichTextBlockPage.vue`]]);export{R as default};