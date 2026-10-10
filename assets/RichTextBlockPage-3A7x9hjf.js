import{$i as e,Ai as t,Bi as n,Ci as r,Cn as i,Ei as a,En as o,Mn as s,Yi as c,a as l,at as u,bi as d,ci as f,dr as p,fr as m,gi as h,ki as g,mt as _,o as v,p as y,t as b,ui as x,ut as S}from"./ScrollViewer-DXAtwYnH.js";import{t as C}from"./Button-1Ztf3pH0.js";import{s as w}from"./ItemsView-CNbp9FUM.js";import{t as T}from"./StackPanel-DGz4UnE4.js";import{t as E}from"./ToggleButton-D0RGNdIP.js";import{t as D}from"./ComboBox-yrHI7YvG.js";import{t as O}from"./inlineControlProperties-DW-Mpt01.js";import{t as k}from"./ControlExample-BX-yRpiQ.js";import{t as A}from"./RichTextBlockOverflow-FWyl8gVq.js";import{t as j}from"./RichTextBlock-BNyCuSHm.js";import{t as M}from"./pageState-cPponcIo.js";var N=`--- header
A simple RichTextBlock.
--- xaml
<RichTextBlock>
    <Paragraph>I am a RichTextBlock.</Paragraph>
</RichTextBlock>`,P=`--- header
A RichTextBlock with a custom selection highlight color.
--- xaml
<RichTextBlock SelectionHighlightColor="Green">
    <Paragraph>RichTextBlock provides a rich text display container that supports
        <Run FontStyle="Italic" FontWeight="Bold">formatted text</Run>,
        <Hyperlink NavigateUri="https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink">hyperlinks</Hyperlink>, inline images, and other rich content.</Paragraph>
    <Paragraph>RichTextBlock also supports a built-in overflow model.</Paragraph>
</RichTextBlock>`,F=`--- header
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
</Grid>`,I=`--- header
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
}`,L=s({__name:`RichTextBlockPage`,setup(s){let{t:L}=y(),{isFavoriteState:R,pageTheme:z,toggleTheme:B,toggleFavorite:V}=M(d(`currentPage`)?.value||`richtextblock`),H=c({});t(p,H);let U=f(()=>({Title:L(`text.richtextblock`),Description:L(`sample.richtextblock.description`),ToggleTheme:L(`gallery.page-header.toggle-theme`),Header0:L(`sample.richtextblock.simple`),Text4:L(`sample.richtextblock.simple-text`),Header1:L(`sample.richtextblock.selection-highlight`),Text6:L(`sample.richtextblock.rich-container-supports`),Text7:L(`sample.richtextblock.formatted-text`),Text8:L(`TextControls.RichTextBlock.Label1`),Text9:L(`sample.richtextblock.hyperlinks`),Text10:L(`TextControls.RichTextBlock.Label2`),Text11:L(`sample.richtextblock.overflow-support`),Header2:L(`sample.richtextblock.overflow`),Text13:L(`sample.richtextblock.overflow-paragraph`),Text14:L(`TextControls.RichTextBlock.Label3`),Text15:L(`TextControls.RichTextBlock.Label4`),Text16:L(`TextControls.RichTextBlock.Label5`),Header3:L(`sample.richtextblock.custom-highlighting`),Text18:L(`TextControls.RichTextBlock.Label6`),Text19:L(`sample.richtextblock.highlighting-color`),Text20:L(`text.yellow`),Text21:L(`text.red`),Text22:L(`text.blue`)})),W=f(()=>L(R.value?`gallery.remove-favorite`:`gallery.add-favorite`)),G=f(()=>R.value?``:``),K=[N,P,F,I].map(e=>({Xaml:e.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim()??``,CSharp:e.split(/^--- c#\r?\n/m)[1]?.trim()??``}));K[2].Xaml=K[2].Xaml.replace(/(<ColumnDefinition\/>\s*)<Grid\.ColumnDefinitions>/,`$1</Grid.ColumnDefinitions>`);let q=`Yellow`,J=()=>{let e=H.TextHighlightingRichTextBlock?.TextHighlighters;e&&(e.Clear(),e.Add({Background:q,Ranges:[{StartIndex:28,Length:11}]}))};return a(async()=>{await r(),J()}),t(m,{Labels:U,FavoriteLabel:W,FavoriteGlyph:G,isFavoriteState:R,pageTheme:z,Sources:K,toggleTheme:B,toggleFavorite:V,HighlightColorCombobox_SelectionChanged:e=>{q=[`Yellow`,`Red`,`Blue`][e.SelectedIndex]??`Yellow`,J()}}),(t,r)=>(g(),x(i,null,{default:n(()=>[h(b,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[h(T,{class:`gallery-item-page`},{default:n(()=>[h(T,{class:`page-heading`},{default:n(()=>[h(v,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`}),h(v,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),h(T,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[h(C,{Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[h(l,{Glyph:``,FontSize:`16`})]),_:1}),h(E,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[h(l,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),h(T,{class:`gallery-page-content`},{default:n(()=>[h(T,null,{default:n(()=>[h(k,{"x:Name":`Example1`,SampleDefinition:`RichTextBlock\\SimpleRichtextblock.txt`,HeaderText:`{x:Bind Labels.Header0, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[0].Xaml}`,CSharp:`{x:Bind Sources[0].CSharp}`},{default:n(()=>[h(k.Example,null,{default:n(()=>[h(j,null,{default:n(()=>[h(e(S),null,{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text4, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),h(k.Output),h(k.Options)]),_:1}),h(k,{"x:Name":`Example2`,SampleDefinition:`RichTextBlock\\RichtextblockCustomSelectionHighlight.txt`,HeaderText:`{x:Bind Labels.Header1, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[1].Xaml}`,CSharp:`{x:Bind Sources[1].CSharp}`},{default:n(()=>[h(k.Example,null,{default:n(()=>[h(j,{SelectionHighlightColor:`Green`},{default:n(()=>[h(e(S),null,{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text6, Mode=OneWay}`}),h(e(_),{FontStyle:`Italic`,FontWeight:`Bold`,Text:`{x:Bind Labels.Text7, Mode=OneWay}`}),h(e(_),{Text:`{x:Bind Labels.Text8, Mode=OneWay}`}),h(e(u),{NavigateUri:`https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.Documents.Hyperlink`},{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text9, Mode=OneWay}`})]),_:1}),h(e(_),{Text:`{x:Bind Labels.Text10, Mode=OneWay}`})]),_:1}),h(e(S),null,{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text11, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),h(k.Output),h(k.Options)]),_:1}),h(k,{"x:Name":`Example3`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichTextBlock\\RichtextblockOverflow.txt`,HeaderText:`{x:Bind Labels.Header2, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[2].Xaml}`,CSharp:`{x:Bind Sources[2].CSharp}`},{default:n(()=>[h(k.Example,null,{default:n(()=>[h(o,{Height:`300`},{default:n(()=>[h(o.ColumnDefinitions,null,{default:n(()=>[h(w),h(w),h(w)]),_:1}),h(j,{"Grid.Column":`0`,Margin:`12,0`,OverflowContentTarget:`{x:Bind firstOverflowContainer}`,TextAlignment:`Justify`},{default:n(()=>[h(e(S),null,{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text13, Mode=OneWay}`})]),_:1}),h(e(S),null,{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text14, Mode=OneWay}`})]),_:1})]),_:1}),h(A,{"x:Name":`firstOverflowContainer`,"Grid.Column":`1`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text15, Mode=OneWay}`,OverflowContentTarget:`{x:Bind secondOverflowContainer}`}),h(A,{"x:Name":`secondOverflowContainer`,"Grid.Column":`2`,Margin:`12,0`,"AutomationProperties.Name":`{x:Bind Labels.Text16, Mode=OneWay}`})]),_:1})]),_:1}),h(k.Output),h(k.Options)]),_:1}),h(k,{SampleDefinition:`RichTextBlock\\RichtextblockCustomTexthighlighting.txt`,HeaderText:`{x:Bind Labels.Header3, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[3].Xaml}`,CSharp:`{x:Bind Sources[3].CSharp}`},{default:n(()=>[h(k.Example,null,{default:n(()=>[h(j,{"x:Name":`TextHighlightingRichTextBlock`},{default:n(()=>[h(e(S),null,{default:n(()=>[h(e(_),{Text:`{x:Bind Labels.Text18, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),h(k.Output),h(k.Options,null,{default:n(()=>[h(T,null,{default:n(()=>[h(D,{Header:`{x:Bind Labels.Text19, Mode=OneWay}`,SelectionChanged:`HighlightColorCombobox_SelectionChanged`},{default:n(()=>[h(e(O),{Content:`{x:Bind Labels.Text20, Mode=OneWay}`,IsSelected:`True`}),h(e(O),{Content:`{x:Bind Labels.Text21, Mode=OneWay}`}),h(e(O),{Content:`{x:Bind Labels.Text22, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-0d35c88f`]]);export{L as default};