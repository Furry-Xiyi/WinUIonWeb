import{Dn as e,Fi as t,I as n,Lt as r,Sn as i,Ti as a,Wi as o,Wt as s,a as c,ai as l,di as u,et as d,hi as f,jn as p,o as m,or as h,ri as g,sr as _,t as v,vi as y,wi as b,xi as x}from"./ScrollViewer-PoO_ma9Z.js";import{t as S}from"./Button-DjU0urmJ.js";import{s as C}from"./ItemsView-FqZP_Xt-.js";import{t as w}from"./ComboBox-UT72V9ez.js";import{t as T}from"./inlineControlProperties-DcOtwrbn.js";import{t as E}from"./StackPanel-CT7pl8zy.js";import{t as D}from"./RichTextBlock-BmiMaFGI.js";import{t as O}from"./RichTextBlockOverflow-BbOe9hta.js";import{t as k}from"./ToggleButton-DwmhXZge.js";import{t as A}from"./ControlExample-C1ahTZEr.js";import{t as j}from"./pageState-BN3kXI7L.js";var M=`--- header
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
}`,I={__name:`RichTextBlockPage`,setup(t,{expose:s}){s();let{t:l}=d(),u=f(`currentPage`),{isFavoriteState:b,pageTheme:I,toggleTheme:L,toggleFavorite:R}=j(u?.value||`richtextblock`),z=o({});a(h,z);let B=g(()=>({Title:l(`text.richtextblock`),Description:l(`sample.richtextblock.description`),ToggleTheme:l(`gallery.page-header.toggle-theme`),Header0:l(`sample.richtextblock.simple`),Text4:l(`sample.richtextblock.simple-text`),Header1:l(`sample.richtextblock.selection-highlight`),Text6:l(`sample.richtextblock.rich-container-supports`),Text7:l(`sample.richtextblock.formatted-text`),Text8:l(`TextControls.RichTextBlock.Label1`),Text9:l(`sample.richtextblock.hyperlinks`),Text10:l(`TextControls.RichTextBlock.Label2`),Text11:l(`sample.richtextblock.overflow-support`),Header2:l(`sample.richtextblock.overflow`),Text13:l(`sample.richtextblock.overflow-paragraph`),Text14:l(`TextControls.RichTextBlock.Label3`),Text15:l(`TextControls.RichTextBlock.Label4`),Text16:l(`TextControls.RichTextBlock.Label5`),Header3:l(`sample.richtextblock.custom-highlighting`),Text18:l(`TextControls.RichTextBlock.Label6`),Text19:l(`sample.richtextblock.highlighting-color`),Text20:l(`text.yellow`),Text21:l(`text.red`),Text22:l(`text.blue`)})),V=g(()=>l(b.value?`gallery.remove-favorite`:`gallery.add-favorite`)),H=g(()=>b.value?``:``),U=[M,N,P,F].map(e=>({Xaml:e.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim()??``,CSharp:e.split(/^--- c#\r?\n/m)[1]?.trim()??``}));U[2].Xaml=U[2].Xaml.replace(/(<ColumnDefinition\/>\s*)<Grid\.ColumnDefinitions>/,`$1</Grid.ColumnDefinitions>`);let W=`Yellow`,G=()=>{let e=z.TextHighlightingRichTextBlock?.TextHighlighters;e&&(e.Clear(),e.Add({Background:W,Ranges:[{StartIndex:28,Length:11}]}))},K=e=>{W=[`Yellow`,`Red`,`Blue`][e.SelectedIndex]??`Yellow`,G()};x(async()=>{await y(),G()}),a(_,{Labels:B,FavoriteLabel:V,FavoriteGlyph:H,isFavoriteState:b,pageTheme:I,Sources:U,toggleTheme:L,toggleFavorite:R,HighlightColorCombobox_SelectionChanged:K});let q={t:l,currentPage:u,isFavoriteState:b,pageTheme:I,toggleTheme:L,toggleFavorite:R,controls:z,Labels:B,FavoriteLabel:V,FavoriteGlyph:H,Sources:U,get selectedHighlightColor(){return W},set selectedHighlightColor(e){W=e},applyHighlight:G,HighlightColorCombobox_SelectionChanged:K,computed:g,inject:f,nextTick:y,onMounted:x,provide:a,shallowReactive:o,Button:S,ToggleButton:k,FontIcon:c,ControlExample:A,Page:n,ScrollViewer:v,StackPanel:E,Grid:r,ColumnDefinition:C,TextBlock:m,RichTextBlock:D,ComboBox:w,RichTextBlockOverflow:O,get Run(){return p},get Hyperlink(){return i},get Paragraph(){return e},ComboBoxItem:T,get xamlNameScopeKey(){return h},get xamlScopeKey(){return _},get useI18n(){return d},get createPageState(){return j},get Sample0(){return M},get Sample1(){return N},get Sample2(){return P},get Sample3(){return F}};return Object.defineProperty(q,"__isScriptSetup",{enumerable:!1,value:!0}),q}};function L(e,n,r,i,a,o){return b(),l(i.Page,null,{default:t(()=>[u(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[u(i.StackPanel,{class:`page-heading`},{default:t(()=>[u(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`}),u(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:t(()=>[u(i.Button,{Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[u(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),u(i.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[u(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),u(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[u(i.StackPanel,null,{default:t(()=>[u(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`RichTextBlock\\SimpleRichtextblock.txt`,HeaderText:`{x:Bind Labels.Header0, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[0].Xaml}`,CSharp:`{x:Bind Sources[0].CSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.RichTextBlock,null,{default:t(()=>[u(i.Paragraph,null,{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text4, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output),u(i.ControlExample.Options)]),_:1}),u(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`RichTextBlock\\RichtextblockCustomSelectionHighlight.txt`,HeaderText:`{x:Bind Labels.Header1, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[1].Xaml}`,CSharp:`{x:Bind Sources[1].CSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.RichTextBlock,{SelectionHighlightColor:`Green`},{default:t(()=>[u(i.Paragraph,null,{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text6, Mode=OneWay}`}),u(i.Run,{FontStyle:`Italic`,FontWeight:`Bold`,Text:`{x:Bind Labels.Text7, Mode=OneWay}`}),u(i.Run,{Text:`{x:Bind Labels.Text8, Mode=OneWay}`}),u(i.Hyperlink,{NavigateUri:`https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink`},{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text9, Mode=OneWay}`})]),_:1}),u(i.Run,{Text:`{x:Bind Labels.Text10, Mode=OneWay}`})]),_:1}),u(i.Paragraph,null,{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text11, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output),u(i.ControlExample.Options)]),_:1}),u(i.ControlExample,{"x:Name":`Example3`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichTextBlock\\RichtextblockOverflow.txt`,HeaderText:`{x:Bind Labels.Header2, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[2].Xaml}`,CSharp:`{x:Bind Sources[2].CSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.Grid,{Height:`300`},{default:t(()=>[u(i.Grid.ColumnDefinitions,null,{default:t(()=>[u(i.ColumnDefinition),u(i.ColumnDefinition),u(i.ColumnDefinition)]),_:1}),u(i.RichTextBlock,{"Grid.Column":`0`,Margin:`12,0`,OverflowContentTarget:`{x:Bind firstOverflowContainer}`,TextAlignment:`Justify`},{default:t(()=>[u(i.Paragraph,null,{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text13, Mode=OneWay}`})]),_:1}),u(i.Paragraph,null,{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text14, Mode=OneWay}`})]),_:1})]),_:1}),u(i.RichTextBlockOverflow,{"x:Name":`firstOverflowContainer`,"Grid.Column":`1`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text15, Mode=OneWay}`,OverflowContentTarget:`{x:Bind secondOverflowContainer}`}),u(i.RichTextBlockOverflow,{"x:Name":`secondOverflowContainer`,"Grid.Column":`2`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text16, Mode=OneWay}`})]),_:1})]),_:1}),u(i.ControlExample.Output),u(i.ControlExample.Options)]),_:1}),u(i.ControlExample,{SampleDefinition:`RichTextBlock\\RichtextblockCustomTexthighlighting.txt`,HeaderText:`{x:Bind Labels.Header3, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[3].Xaml}`,CSharp:`{x:Bind Sources[3].CSharp}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.RichTextBlock,{"x:Name":`TextHighlightingRichTextBlock`},{default:t(()=>[u(i.Paragraph,null,{default:t(()=>[u(i.Run,{Text:`{x:Bind Labels.Text18, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output),u(i.ControlExample.Options,null,{default:t(()=>[u(i.StackPanel,null,{default:t(()=>[u(i.ComboBox,{Header:`{x:Bind Labels.Text19, Mode=OneWay}`,SelectionChanged:`HighlightColorCombobox_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Text20, Mode=OneWay}`,IsSelected:`True`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Text21, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Text22, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var R=s(I,[[`render`,L],[`__scopeId`,`data-v-0d35c88f`],[`__file`,`RichTextBlockPage.vue`]]);export{R as default};