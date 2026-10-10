import{Ai as e,Bi as t,Ci as n,Cn as r,Ei as i,En as a,Mn as o,Yi as s,a as c,at as l,bi as u,ci as d,dr as f,fr as p,gi as m,ki as h,mt as g,o as _,p as v,t as y,ui as b,ut as x}from"./ScrollViewer-CHNE18MA.js";import{t as S}from"./Button-DO0TiUOq.js";import{s as C}from"./ItemsView-DXNouDjp.js";import{t as w}from"./StackPanel-C60XOD66.js";import{t as T}from"./ToggleButton-ZsjZg8Nu.js";import{t as E}from"./ComboBox-CjdqaKdN.js";import{t as D}from"./inlineControlProperties-k1PUSjJA.js";import{t as O}from"./ControlExample-BKyw2NwY.js";import{t as k}from"./RichTextBlockOverflow-kg1drrLz.js";import{t as A}from"./RichTextBlock-BsOcFqwR.js";import{t as j}from"./pageState-Djrh7EdY.js";var M=`--- header
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
}`,I={__name:`RichTextBlockPage`,setup(t,{expose:o}){o();let{t:m}=v(),h=u(`currentPage`),{isFavoriteState:b,pageTheme:I,toggleTheme:L,toggleFavorite:R}=j(h?.value||`richtextblock`),z=s({});e(f,z);let B=d(()=>({Title:m(`text.richtextblock`),Description:m(`sample.richtextblock.description`),ToggleTheme:m(`gallery.page-header.toggle-theme`),Header0:m(`sample.richtextblock.simple`),Text4:m(`sample.richtextblock.simple-text`),Header1:m(`sample.richtextblock.selection-highlight`),Text6:m(`sample.richtextblock.rich-container-supports`),Text7:m(`sample.richtextblock.formatted-text`),Text8:m(`TextControls.RichTextBlock.Label1`),Text9:m(`sample.richtextblock.hyperlinks`),Text10:m(`TextControls.RichTextBlock.Label2`),Text11:m(`sample.richtextblock.overflow-support`),Header2:m(`sample.richtextblock.overflow`),Text13:m(`sample.richtextblock.overflow-paragraph`),Text14:m(`TextControls.RichTextBlock.Label3`),Text15:m(`TextControls.RichTextBlock.Label4`),Text16:m(`TextControls.RichTextBlock.Label5`),Header3:m(`sample.richtextblock.custom-highlighting`),Text18:m(`TextControls.RichTextBlock.Label6`),Text19:m(`sample.richtextblock.highlighting-color`),Text20:m(`text.yellow`),Text21:m(`text.red`),Text22:m(`text.blue`)})),V=d(()=>m(b.value?`gallery.remove-favorite`:`gallery.add-favorite`)),H=d(()=>b.value?``:``),U=[M,N,P,F].map(e=>({Xaml:e.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim()??``,CSharp:e.split(/^--- c#\r?\n/m)[1]?.trim()??``}));U[2].Xaml=U[2].Xaml.replace(/(<ColumnDefinition\/>\s*)<Grid\.ColumnDefinitions>/,`$1</Grid.ColumnDefinitions>`);let W=`Yellow`,G=()=>{let e=z.TextHighlightingRichTextBlock?.TextHighlighters;e&&(e.Clear(),e.Add({Background:W,Ranges:[{StartIndex:28,Length:11}]}))},K=e=>{W=[`Yellow`,`Red`,`Blue`][e.SelectedIndex]??`Yellow`,G()};i(async()=>{await n(),G()}),e(p,{Labels:B,FavoriteLabel:V,FavoriteGlyph:H,isFavoriteState:b,pageTheme:I,Sources:U,toggleTheme:L,toggleFavorite:R,HighlightColorCombobox_SelectionChanged:K});let q={t:m,currentPage:h,isFavoriteState:b,pageTheme:I,toggleTheme:L,toggleFavorite:R,controls:z,Labels:B,FavoriteLabel:V,FavoriteGlyph:H,Sources:U,get selectedHighlightColor(){return W},set selectedHighlightColor(e){W=e},applyHighlight:G,HighlightColorCombobox_SelectionChanged:K,computed:d,inject:u,nextTick:n,onMounted:i,provide:e,shallowReactive:s,Button:S,ToggleButton:T,FontIcon:c,ControlExample:O,Page:r,ScrollViewer:y,StackPanel:w,Grid:a,ColumnDefinition:C,TextBlock:_,RichTextBlock:A,ComboBox:E,RichTextBlockOverflow:k,get Run(){return g},get Hyperlink(){return l},get Paragraph(){return x},ComboBoxItem:D,get xamlNameScopeKey(){return f},get xamlScopeKey(){return p},get useI18n(){return v},get createPageState(){return j},get Sample0(){return M},get Sample1(){return N},get Sample2(){return P},get Sample3(){return F}};return Object.defineProperty(q,"__isScriptSetup",{enumerable:!1,value:!0}),q}};function L(e,n,r,i,a,o){return h(),b(i.Page,null,{default:t(()=>[m(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[m(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[m(i.StackPanel,{class:`page-heading`},{default:t(()=>[m(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`}),m(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:t(()=>[m(i.Button,{Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[m(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(i.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[m(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),m(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[m(i.StackPanel,null,{default:t(()=>[m(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`RichTextBlock\\SimpleRichtextblock.txt`,HeaderText:`{x:Bind Labels.Header0, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[0].Xaml}`,CSharp:`{x:Bind Sources[0].CSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.RichTextBlock,null,{default:t(()=>[m(i.Paragraph,null,{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text4, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`RichTextBlock\\RichtextblockCustomSelectionHighlight.txt`,HeaderText:`{x:Bind Labels.Header1, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[1].Xaml}`,CSharp:`{x:Bind Sources[1].CSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.RichTextBlock,{SelectionHighlightColor:`Green`},{default:t(()=>[m(i.Paragraph,null,{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text6, Mode=OneWay}`}),m(i.Run,{FontStyle:`Italic`,FontWeight:`Bold`,Text:`{x:Bind Labels.Text7, Mode=OneWay}`}),m(i.Run,{Text:`{x:Bind Labels.Text8, Mode=OneWay}`}),m(i.Hyperlink,{NavigateUri:`https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink`},{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text9, Mode=OneWay}`})]),_:1}),m(i.Run,{Text:`{x:Bind Labels.Text10, Mode=OneWay}`})]),_:1}),m(i.Paragraph,null,{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text11, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example3`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichTextBlock\\RichtextblockOverflow.txt`,HeaderText:`{x:Bind Labels.Header2, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[2].Xaml}`,CSharp:`{x:Bind Sources[2].CSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.Grid,{Height:`300`},{default:t(()=>[m(i.Grid.ColumnDefinitions,null,{default:t(()=>[m(i.ColumnDefinition),m(i.ColumnDefinition),m(i.ColumnDefinition)]),_:1}),m(i.RichTextBlock,{"Grid.Column":`0`,Margin:`12,0`,OverflowContentTarget:`{x:Bind firstOverflowContainer}`,TextAlignment:`Justify`},{default:t(()=>[m(i.Paragraph,null,{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text13, Mode=OneWay}`})]),_:1}),m(i.Paragraph,null,{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text14, Mode=OneWay}`})]),_:1})]),_:1}),m(i.RichTextBlockOverflow,{"x:Name":`firstOverflowContainer`,"Grid.Column":`1`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text15, Mode=OneWay}`,OverflowContentTarget:`{x:Bind secondOverflowContainer}`}),m(i.RichTextBlockOverflow,{"x:Name":`secondOverflowContainer`,"Grid.Column":`2`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text16, Mode=OneWay}`})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{SampleDefinition:`RichTextBlock\\RichtextblockCustomTexthighlighting.txt`,HeaderText:`{x:Bind Labels.Header3, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[3].Xaml}`,CSharp:`{x:Bind Sources[3].CSharp}`},{default:t(()=>[m(i.ControlExample.Example,null,{default:t(()=>[m(i.RichTextBlock,{"x:Name":`TextHighlightingRichTextBlock`},{default:t(()=>[m(i.Paragraph,null,{default:t(()=>[m(i.Run,{Text:`{x:Bind Labels.Text18, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options,null,{default:t(()=>[m(i.StackPanel,null,{default:t(()=>[m(i.ComboBox,{Header:`{x:Bind Labels.Text19, Mode=OneWay}`,SelectionChanged:`HighlightColorCombobox_SelectionChanged`},{default:t(()=>[m(i.ComboBoxItem,{Content:`{x:Bind Labels.Text20, Mode=OneWay}`,IsSelected:`True`}),m(i.ComboBoxItem,{Content:`{x:Bind Labels.Text21, Mode=OneWay}`}),m(i.ComboBoxItem,{Content:`{x:Bind Labels.Text22, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var R=o(I,[[`render`,L],[`__scopeId`,`data-v-0d35c88f`],[`__file`,`RichTextBlockPage.vue`]]);export{R as default};