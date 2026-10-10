import{$ as e,$i as t,Ai as n,Bi as r,Cn as i,Ei as a,Ji as o,Li as s,Mn as ee,Ni as c,P as l,Sr as u,Yi as d,a as f,at as p,bi as te,ci as m,dr as ne,fn as h,fr as g,gi as _,ki as v,mt as y,o as b,p as x,pn as S,t as C,ui as re,ut as w,yi as ie}from"./ScrollViewer-B43ymvAj.js";import{t as T}from"./Button-B49t7g4C.js";import{t as ae}from"./Flyout-DRenxRIy.js";import{t as oe}from"./TextBox-Bab60qPV.js";import{t as E}from"./DropDownButton-D28dmjPt.js";import{t as D}from"./StackPanel-Dy6dKYi5.js";import{t as O}from"./ToggleButton-DDZy2gVz.js";import{t as k}from"./RichEditBox-DDlQaZkc.js";import{n as A,t as j}from"./ControlExample-Ddvmn5_c.js";import{t as M}from"./RelativePanel-B2fMIGyc.js";import{t as N}from"./VariableSizedWrapGrid-n_pTWfbT.js";import{t as P}from"./Rectangle-zyyWCgfm.js";import{t as F}from"./RichTextBlock-UWlhslHG.js";import{t as I}from"./pageState-BQHW0me4.js";import{t as L}from"./StandardUICommand-DzoGIjsC.js";var R=`--- header
A simple text editor using RichEditBox.
--- xaml
<RichEditBox x:Name="editor" AutomationProperties.Name="simple text editor"/>`,z=`--- header
Customizing RichEditBox's CommandBarFlyout - Adding 'Share'
--- xaml
<RichEditBox x:Name="REBCustom" 
    AutomationProperties.Name="editor with custom menu"
    Width="800" Height="200" 
    Loaded="REBCustom_Loaded" 
    Unloaded="REBCustom_Unloaded"/>
--- c#
private void Menu_Opening(object sender, object e)
{
    if (sender is not CommandBarFlyout myFlyout)
    {
        return;
    }

    if (myFlyout.Target == REBCustom)
    {
        AppBarButton myButton = new AppBarButton();
        myButton.Command = new StandardUICommand(StandardUICommandKind.Share);
        myFlyout.PrimaryCommands.Add(myButton);
    }
}

private void REBCustom_Loaded(object sender, RoutedEventArgs e)
{
    REBCustom.SelectionFlyout.Opening += Menu_Opening;
    REBCustom.ContextFlyout.Opening += Menu_Opening;
}

private void REBCustom_Unloaded(object sender, RoutedEventArgs e)
{
    REBCustom.SelectionFlyout.Opening -= Menu_Opening;
    REBCustom.ContextFlyout.Opening -= Menu_Opening;
}`,B=`--- header
A custom editor with RichEditBox.
--- xaml
<RelativePanel Margin="0,0,0,20" HorizontalAlignment="Stretch">
    <RelativePanel.Resources>
        <Style TargetType="Button">
            <Setter Property="BorderThickness" Value="0" />
            <Setter Property="Background" Value="Transparent"/>
            <Setter Property="Margin" Value="0,0,8,0" />
        </Style>
    </RelativePanel.Resources>
    <Button x:Name="openFileButton" Click="OpenButton_Click" AutomationProperties.Name="Open file" ToolTipService.ToolTip="Open file">
        <Button.Content>
            <FontIcon Glyph="&#xE8E5;"/>
        </Button.Content>
    </Button>
    <Button Click="SaveButton_Click" AutomationProperties.Name="Save file" ToolTipService.ToolTip="Save file" 
            RelativePanel.RightOf="openFileButton">
        <Button.Content>
            <FontIcon Glyph="&#xE74E;"/>
        </Button.Content>
    </Button>
    <Button AutomationProperties.Name="Bold" ToolTipService.ToolTip="Bold" Click="BoldButton_Click" 
            RelativePanel.LeftOf="italicButton" >
        <Button.Content>
            <FontIcon Glyph="&#xE8DD;"/>
        </Button.Content>
    </Button>
    <Button x:Name="italicButton" Click="ItalicButton_Click" AutomationProperties.Name="Italic" ToolTipService.ToolTip="Italic" 
            RelativePanel.LeftOf="fontColorButton">
        <Button.Content>
            <FontIcon Glyph="&#xE8DB;"/>
        </Button.Content>
    </Button>

    <DropDownButton x:Name="fontColorButton" AutomationProperties.Name="Font color"
                                BorderThickness="0" ToolTipService.ToolTip="Font color"
                                Background="Transparent" 
                                RelativePanel.AlignRightWithPanel="True">
        <SymbolIcon Symbol="FontColor"/>
        <DropDownButton.Flyout>
            <Flyout Placement="Bottom">
                <VariableSizedWrapGrid Orientation="Horizontal" MaximumRowsOrColumns="3">
                    <VariableSizedWrapGrid.Resources>
                        <Style TargetType="Rectangle">
                            <Setter Property="Width" Value="32"/>
                            <Setter Property="Height" Value="32"/>
                        </Style>
                        <Style TargetType="Button">
                            <Setter Property="Padding" Value="0"/>
                            <Setter Property="MinWidth" Value="0"/>
                            <Setter Property="MinHeight" Value="0"/>
                            <Setter Property="Margin" Value="6"/>
                        </Style>
                    </VariableSizedWrapGrid.Resources>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Red">
                        <Button.Content>
                            <Rectangle Fill="Red"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Orange">
                        <Button.Content>
                            <Rectangle Fill="Orange"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Yellow">
                        <Button.Content>
                            <Rectangle Fill="Yellow"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Green">
                        <Button.Content>
                            <Rectangle Fill="Green"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Blue">
                        <Button.Content>
                            <Rectangle Fill="Blue"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Indigo">
                        <Button.Content>
                            <Rectangle Fill="Indigo"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Violet">
                        <Button.Content>
                            <Rectangle Fill="Violet"/>
                        </Button.Content>
                    </Button>
                    <Button Click="ColorButton_Click" AutomationProperties.Name="Gray">
                        <Button.Content>
                            <Rectangle Fill="Gray"/>
                        </Button.Content>
                    </Button>
                </VariableSizedWrapGrid>
            </Flyout>
        </DropDownButton.Flyout>
    </DropDownButton>

    <RichEditBox x:Name="editor" Height="200" AutomationProperties.Name="Custom editor"
                    RelativePanel.Below="openFileButton" 
                    RelativePanel.AlignLeftWithPanel="True" 
                    RelativePanel.AlignRightWithPanel="True" 
                    TextChanged="Editor_TextChanged"
                    GotFocus="Editor_GotFocus"/>
    <StackPanel Orientation="Horizontal" 
                RelativePanel.Below="editor" 
                RelativePanel.AlignLeftWith="editor" 
                Margin="0,10,0,0">
        <TextBlock x:Name="findBoxLabel" Text="Find:" Height="20"/>
        <TextBox x:Name="findBox" Width="150" PlaceholderText="Enter search text" Margin="10,0,0,0"
                TextChanged="{x:Bind FindBoxHighlightMatches}" 
                GotFocus="{x:Bind FindBoxHighlightMatches}" 
                LostFocus="{x:Bind FindBoxRemoveHighlights}"/>
    </StackPanel>
</RelativePanel>
--- c#
private async void OpenButton_Click(object sender, RoutedEventArgs e)
{
    if (sender is Button button)
    {
        // Create the picker using the AppWindowId from the element
        var picker = new FileOpenPicker(button.XamlRoot.ContentIslandEnvironment.AppWindowId)
        {
            SuggestedStartLocation = PickerLocationId.DocumentsLibrary
        };

        // Add file type filters
        picker.FileTypeFilter.Add(".rtf");

        // Show picker
        PickFileResult result = await picker.PickSingleFileAsync();

        if (result != null)
        {
            // Open with StorageFile (needed for RichEditBox)
            StorageFile file = await StorageFile.GetFileFromPathAsync(result.Path);

            using IRandomAccessStream randAccStream =
                await file.OpenAsync(FileAccessMode.Read);

            // Load file into the RichEditBox
            editor.Document.LoadFromStream(TextSetOptions.FormatRtf, randAccStream);
        }
    }
}

private async void SaveButton_Click(object sender, RoutedEventArgs e)
{
    if (sender is Button button)
    {
        // Create the picker with AppWindowId
        var savePicker = new FileSavePicker(button.XamlRoot.ContentIslandEnvironment.AppWindowId)
        {
            SuggestedStartLocation = PickerLocationId.DocumentsLibrary,
            SuggestedFileName = "New Document"
        };

        // Dropdown of file types the user can save the file as
        savePicker.FileTypeChoices.Add("Rich Text", new List<string>() { ".rtf" });

        // Show picker
        PickFileResult result = await savePicker.PickSaveFileAsync();

        if (result != null)
        {
            // Convert PickSaveFileResult to StorageFile
            StorageFile file = await StorageFile.GetFileFromPathAsync(result.Path);

            // Prevent updates to the remote version of the file until complete
            CachedFileManager.DeferUpdates(file);

            // Write content into the file
            using IRandomAccessStream randAccStream =
                await file.OpenAsync(FileAccessMode.ReadWrite);

            editor.Document.SaveToStream(TextGetOptions.FormatRtf, randAccStream);

            // Finalize file updates
            FileUpdateStatus status = await CachedFileManager.CompleteUpdatesAsync(file);

            if (status != FileUpdateStatus.Complete)
            {
                var errorBox = new Windows.UI.Popups.MessageDialog(
                    $"File {file.Name} couldn't be saved.");
                await errorBox.ShowAsync();
            }
        }
    }
}

private void BoldButton_Click(object sender, RoutedEventArgs e)
{
    editor.Document.Selection.CharacterFormat.Bold = FormatEffect.Toggle;
}

private void ItalicButton_Click(object sender, RoutedEventArgs e)
{
    editor.Document.Selection.CharacterFormat.Italic = FormatEffect.Toggle;
}

private void ColorButton_Click(object sender, RoutedEventArgs e)
{
    // Extract the color of the button that was clicked.
    Button clickedColor = (Button)sender;
    var rectangle = (Microsoft.UI.Xaml.Shapes.Rectangle)clickedColor.Content;
    var color = ((Microsoft.UI.Xaml.Media.SolidColorBrush)rectangle.Fill).Color;

    editor.Document.Selection.CharacterFormat.ForegroundColor = color;

    fontColorButton.Flyout.Hide();
    editor.Focus(Microsoft.UI.Xaml.FocusState.Keyboard);
}

private void FindBoxHighlightMatches()
{
    FindBoxRemoveHighlights();

    Color highlightBackgroundColor = (Color)App.Current.Resources["SystemColorHighlightColor"];
    Color highlightForegroundColor = (Color)App.Current.Resources["SystemColorHighlightTextColor"];

    string textToFind = findBox.Text;
    if (textToFind != null)
    {
        ITextRange searchRange = editor.Document.GetRange(0, 0);
        while (searchRange.FindText(textToFind, TextConstants.MaxUnitCount, FindOptions.None) > 0)
        {
            searchRange.CharacterFormat.BackgroundColor = highlightBackgroundColor;
            searchRange.CharacterFormat.ForegroundColor = highlightForegroundColor;
        }
    }
}

private void FindBoxRemoveHighlights()
{
    if (editor.Background is not SolidColorBrush defaultBackground ||
        editor.Foreground is not SolidColorBrush defaultForeground)
    {
        return;
    }

    ITextRange documentRange = editor.Document.GetRange(0, TextConstants.MaxUnitCount);

    documentRange.CharacterFormat.BackgroundColor = defaultBackground.Color;
    documentRange.CharacterFormat.ForegroundColor = defaultForeground.Color;
}

private void Editor_GotFocus(object sender, RoutedEventArgs e)
{
    editor.Document.GetText(TextGetOptions.UseCrlf, out _);
            
    // reset colors to correct defaults for Focused state
    ITextRange documentRange = editor.Document.GetRange(0, TextConstants.MaxUnitCount);
    SolidColorBrush background = (SolidColorBrush)App.Current.Resources["TextControlBackgroundFocused"];

    if (background != null)
    {
        documentRange.CharacterFormat.BackgroundColor = background.Color;
    }
}

private void Editor_TextChanged(object sender, RoutedEventArgs e)
{
    editor.Document.Selection.CharacterFormat.ForegroundColor = currentColor;
}`,V=`--- header
Rich edit box in math mode
--- xaml
<RichEditBox x:Name="mathEditor" FontSize="16" />
--- c#
mathEditor.TextDocument.SetMathMode(RichEditMathMode.MathOnly);`,H=`--- header
Working with MathML in RichEditBox
--- xaml
<RichEditBox x:Name="mathEditor2" FontSize="16" />
--- c#
mathEditor2.TextDocument.SetMathMode(RichEditMathMode.MathOnly);

private void mathEditor2_TextChanged(object sender, RoutedEventArgs e)
{
    // Extracts the MathML content from the RichEditBox
    string extractedMathML;
    mathEditor2.Document.GetMathML(out extractedMathML);
    
    // If MathML content is available, format and display it in the MathML presenter
    if (!string.IsNullOrEmpty(extractedMathML))
    {
        MathmlPresenter.Code = MathModeHelper.FormatMathML(extractedMathML);
    }
    else
    {
        // If no MathML content exists, display a placeholder comment
        MathmlPresenter.Code = "<!-- No MathML content -->";
    }
}

private void SetMathmlFormulaBtn_Click(object sender, RoutedEventArgs e)
{
    // Defines a formula in MathML format
    string formulaMathML =
        "<mml:math xmlns:mml=\\"http://www.w3.org/1998/Math/MathML\\" display=\\"block\\">\\r\\n" +
        "  <mml:mi mathcolor=\\"#000000\\">x</mml:mi>\\r\\n" +
        "  <mml:mo mathcolor=\\"#000000\\">\\u2208</mml:mo>\\r\\n" +
        "  <mml:mi mathcolor=\\"#000000\\">P</mml:mi>\\r\\n" +
        "  <mml:mfenced>\\r\\n" +
        "    <mml:mrow>\\r\\n" +
        "      <mml:mi mathcolor=\\"#000000\\">A</mml:mi>\\r\\n" +
        "    </mml:mrow>\\r\\n" +
        "  </mml:mfenced>\\r\\n" +
        "  <mml:mo mathcolor=\\"#000000\\">\\u2194</mml:mo>\\r\\n" +
        "  <mml:mi mathcolor=\\"#000000\\">x</mml:mi>\\r\\n" +
        "  <mml:mo mathcolor=\\"#000000\\">\\u2286</mml:mo>\\r\\n" +
        "  <mml:mi mathcolor=\\"#000000\\">A</mml:mi>\\r\\n" +
        "</mml:math>";

    // Adjusts text color based on the current app theme
    if(mathEditor2.ActualTheme == ElementTheme.Dark)
    {
        // If in dark mode, set text color to white
        mathEditor2.Document.SetMathML(formulaMathML.Replace("mathcolor=\\"#000000\\"", "mathcolor=\\"#FFFFFF\\""));
    }
    else
    {
        // If in light mode, set text color to black
        mathEditor2.Document.SetMathML(formulaMathML.Replace("mathcolor=\\"#FFFFFF\\"", "mathcolor=\\"#000000\\""));
    }
}`,U=ee({__name:`RichEditBoxPage`,setup(ee){let{t:U}=x(),{isFavoriteState:W,pageTheme:G,toggleTheme:K,toggleFavorite:se}=I(te(`currentPage`)?.value||`richeditbox`),q=d({});n(ne,q);let ce=m(()=>({Title:U(`text.richeditbox`),Description:U(`text.the-richeditbox-control-lets-a-user-enter-format`),ToggleTheme:U(`gallery.page-header.toggle-theme`),Header0:U(`text.a-simple-text-editor-with-richeditbox`),Text4:U(`TextControls.RichEditBox.Label1`),Header1:U(`sample.richeditbox.custom-command-flyout`),Text6:U(`TextControls.RichEditBox.Label2`),Header2:U(`sample.richeditbox.custom-formatting-editor`),Text8:U(`sample.richeditbox.open-file`),Text9:U(`sample.richeditbox.open-file`),Text10:U(`sample.richeditbox.save-file`),Text11:U(`sample.richeditbox.save-file`),Text12:U(`sample.richeditbox.bold`),Text13:U(`sample.richeditbox.bold`),Text14:U(`sample.richeditbox.italic`),Text15:U(`sample.richeditbox.italic`),Text16:U(`sample.splitbutton.font-color`),Text17:U(`sample.splitbutton.font-color`),Text18:U(`text.red`),Text19:U(`sample.orange`),Text20:U(`text.yellow`),Text21:U(`text.green`),Text22:U(`text.blue`),Text23:U(`sample.indigo`),Text24:U(`sample.violet`),Text25:U(`sample.gray`),Text26:U(`sample.richeditbox.custom-editor`),Text27:U(`sample.richeditbox.find-label`),Text28:U(`sample.richeditbox.search-placeholder`),Header3:U(`sample.richeditbox.math-mode`),Text30:U(`sample.richeditbox.math-note`),Text31:U(`TextControls.RichEditBox.Label3`),Text32:U(`TextControls.RichEditBox.Label4`),Text33:U(`TextControls.RichEditBox.Label5`),Text34:U(`sample.richeditbox.math-example`),Text35:U(`TextControls.RichEditBox.Label6`),Header4:U(`sample.richeditbox.mathml`),Text37:U(`TextControls.RichEditBox.Label7`),Text38:U(`TextControls.RichEditBox.Label8`),Text39:U(`TextControls.RichEditBox.Label9`),Text40:U(`TextControls.RichEditBox.Label10`),Text41:U(`TextControls.RichEditBox.Label11`),Text42:U(`text.richeditbox`),Text43:U(`TextControls.RichEditBox.Label12`),Text44:U(`TextControls.RichEditBox.Label13`),Text45:U(`TextControls.RichEditBox.Label14`),Text46:U(`TextControls.RichEditBox.Label15`),Text47:U(`text.richeditbox`),Text48:U(`TextControls.RichEditBox.Label16`),Text49:U(`TextControls.RichEditBox.Label17`),Text50:U(`text.richeditbox`),Text51:U(`TextControls.RichEditBox.Label18`),Text52:U(`TextControls.RichEditBox.Label19`),Text53:U(`TextControls.RichEditBox.Label20`),Text54:U(`TextControls.RichEditBox.Label21`),Text55:U(`TextControls.RichEditBox.Label22`),Text56:U(`TextControls.RichEditBox.Label23`),Text57:U(`TextControls.RichEditBox.Label24`),Text58:U(`sample.richeditbox.mathml-code`),Text59:U(`sample.richeditbox.set-sample-formula`)})),le=m(()=>U(W.value?`gallery.remove-favorite`:`gallery.add-favorite`)),ue=m(()=>W.value?``:``),de=[R,z,B,V,H].map(e=>({Xaml:e.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim()??``,CSharp:e.split(/^--- c#\r?\n/m)[1]?.trim()??``})),fe=()=>{let e=document.createElement(`input`);e.type=`file`,e.accept=`.rtf`,e.addEventListener(`change`,async()=>{let t=e.files?.[0];t&&await q.editor.Document.LoadFromStream(`FormatRtf`,t)},{once:!0}),e.click()},pe=()=>{let e=q.editor.Document.SaveToStream(`FormatRtf`),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`${U(`TextControls.RichEditBox.NewDocument`)}.rtf`,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)},me=()=>{q.editor.Document.Selection.CharacterFormat.Bold=`Toggle`},he=()=>{q.editor.Document.Selection.CharacterFormat.Italic=`Toggle`},J=`Green`,Y=!1,ge=e=>{let t=e.Content?.Fill??e.CommandParameter;typeof t==`string`&&(J=t,q.editor.Document.Selection.CharacterFormat.ForegroundColor=t,q.fontColorButton.Flyout.Hide(),q.editor.Focus(`Keyboard`))},X=()=>{if(!q.editor)return;let e=q.editor.Document.GetRange(0,2**53-1);Y=!0;try{e.CharacterFormat.BackgroundColor=q.editor.Background,e.CharacterFormat.ForegroundColor=q.editor.Foreground}finally{Y=!1}},_e=()=>{X();let e=q.findBox?.Text??``;if(!e)return;let t=q.editor.Document.GetRange(0,0);Y=!0;try{for(;t.FindText(e,2**53-1,`None`)>0;)t.CharacterFormat.BackgroundColor=`Highlight`,t.CharacterFormat.ForegroundColor=`HighlightText`}finally{Y=!1}},ve=()=>{if(q.editor){Y=!0;try{q.editor.Document.GetRange(0,2**53-1).CharacterFormat.BackgroundColor=q.editor.Background}finally{Y=!1}}},Z=()=>{if(!(Y||!q.editor)){Y=!0;try{q.editor.Document.Selection.CharacterFormat.ForegroundColor=J}finally{Y=!1}}},ye=new L(`Share`),Q=e=>{e.Target!==q.REBCustom||e.PrimaryCommands.some(e=>e.key===`Share`)||e.PrimaryCommands.push(ie(l,{key:`Share`,Command:ye}))},be=e=>{e.SelectionFlyout.addEventListener(`Opening`,Q),e.ContextFlyout.addEventListener(`Opening`,Q)},xe=e=>{e.SelectionFlyout.removeEventListener(`Opening`,Q),e.ContextFlyout.removeEventListener(`Opening`,Q)},$=o(``);return a(()=>{q.MathEditor.Document.SetMathMode(`MathOnly`),q.mathEditor2.Document.SetMathMode(`MathOnly`),$.value=U(`TextControls.NoMathML`)}),s(()=>U(`TextControls.NoMathML`),e=>{q.mathEditor2?.Document.GetMathML()||($.value=e)}),n(g,{Labels:ce,FavoriteLabel:le,FavoriteGlyph:ue,isFavoriteState:W,pageTheme:G,Sources:de,MathmlCode:$,toggleTheme:K,toggleFavorite:se,OpenButton_Click:fe,SaveButton_Click:pe,BoldButton_Click:me,ItalicButton_Click:he,ColorButton_Click:ge,FindBoxHighlightMatches:_e,FindBoxRemoveHighlights:X,Editor_GotFocus:ve,Editor_TextChanged:Z,REBCustom_Loaded:be,REBCustom_Unloaded:xe,mathEditor2_TextChanged:e=>{e.Document.GetMathMode()===`MathOnly`&&($.value=e.Document.GetMathML()||U(`TextControls.NoMathML`))},SetMathmlFormulaBtn_Click:()=>{q.mathEditor2.Document.SetMathML(`<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi><mo>∈</mo><mi>P</mi><mfenced><mrow><mi>A</mi></mrow></mfenced><mo>↔</mo><mi>x</mi><mo>⊆</mo><mi>A</mi></math>`)}}),(n,a)=>{let o=c(`StaticResource`);return v(),re(i,{Theme:`{x:Bind pageTheme, Mode=OneWay}`},{default:r(()=>[_(C,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[_(D,{class:`gallery-item-page`},{default:r(()=>[_(D,{class:`page-heading`},{default:r(()=>[_(b,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`}),_(b,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(D,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:r(()=>[_(T,{Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:r(()=>[_(f,{Glyph:``,FontSize:`16`})]),_:1}),_(O,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:r(()=>[_(f,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),_(D,{class:`gallery-page-content`},{default:r(()=>[_(D,null,{default:r(()=>[_(j,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichEditBox\\SimpleTextEditorRicheditbox.txt`,HeaderText:`{x:Bind Labels.Header0, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[0].Xaml}`,CSharp:`{x:Bind Sources[0].CSharp}`},{default:r(()=>[_(j.Example,null,{default:r(()=>[_(k,{"AutomationProperties.Name":`{x:Bind Labels.Text4, Mode=OneWay}`})]),_:1}),_(j.Output),_(j.Options)]),_:1}),_(j,{SampleDefinition:`RichEditBox\\CustomizingRicheditboxCommandbarflyoutAdding.txt`,HeaderText:`{x:Bind Labels.Header1, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[1].Xaml}`,CSharp:`{x:Bind Sources[1].CSharp}`},{default:r(()=>[_(j.Example,null,{default:r(()=>[_(k,{"x:Name":`REBCustom`,Width:`800`,Height:`200`,"AutomationProperties.Name":`{x:Bind Labels.Text6, Mode=OneWay}`,Loaded:`REBCustom_Loaded`,Unloaded:`REBCustom_Unloaded`})]),_:1}),_(j.Output),_(j.Options)]),_:1}),_(j,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichEditBox\\CustomEditorRicheditbox.txt`,HeaderText:`{x:Bind Labels.Header2, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[2].Xaml}`,CSharp:`{x:Bind Sources[2].CSharp}`},{default:r(()=>[_(j.Example,null,{default:r(()=>[_(M,{Margin:`0,0,0,20`,HorizontalAlignment:`Stretch`},{default:r(()=>[_(M.Resources,null,{default:r(()=>[_(t(u),null,{default:r(()=>[_(t(S),{TargetType:`Button`},{default:r(()=>[_(t(h),{Property:`BorderThickness`,Value:`0`}),_(t(h),{Property:`Background`,Value:`Transparent`}),_(t(h),{Property:`Margin`,Value:`0,0,8,0`})]),_:1}),_(t(u).ThemeDictionaries,null,{default:r(()=>[_(t(u),{"x:Key":`HighContrast`},{default:r(()=>[_(o,{"x:Key":`ButtonBackgroundPointerOver`,ResourceKey:`SystemColorHighlightColor`})]),_:1})]),_:1})]),_:1})]),_:1}),_(T,{"x:Name":`openFileButton`,"AutomationProperties.Name":`{x:Bind Labels.Text8, Mode=OneWay}`,Click:`OpenButton_Click`,"ToolTipService.ToolTip":`{x:Bind Labels.Text9, Mode=OneWay}`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(f,{Glyph:``})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text10, Mode=OneWay}`,Click:`SaveButton_Click`,"RelativePanel.RightOf":`openFileButton`,"ToolTipService.ToolTip":`{x:Bind Labels.Text11, Mode=OneWay}`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(f,{Glyph:``})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text12, Mode=OneWay}`,Click:`BoldButton_Click`,"RelativePanel.LeftOf":`italicButton`,"ToolTipService.ToolTip":`{x:Bind Labels.Text13, Mode=OneWay}`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(f,{Glyph:``})]),_:1})]),_:1}),_(T,{"x:Name":`italicButton`,"AutomationProperties.Name":`{x:Bind Labels.Text14, Mode=OneWay}`,Click:`ItalicButton_Click`,"RelativePanel.LeftOf":`fontColorButton`,"ToolTipService.ToolTip":`{x:Bind Labels.Text15, Mode=OneWay}`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(f,{Glyph:``})]),_:1})]),_:1}),_(E,{"x:Name":`fontColorButton`,"AutomationProperties.Name":`{x:Bind Labels.Text16, Mode=OneWay}`,Background:`Transparent`,BorderThickness:`0`,"RelativePanel.AlignRightWithPanel":`True`,"ToolTipService.ToolTip":`{x:Bind Labels.Text17, Mode=OneWay}`},{default:r(()=>[_(e,{Symbol:`FontColor`}),_(E.Flyout,null,{default:r(()=>[_(ae,{Placement:`Bottom`},{default:r(()=>[_(N,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`},{default:r(()=>[_(N.Resources,null,{default:r(()=>[_(t(S),{TargetType:`Rectangle`},{default:r(()=>[_(t(h),{Property:`Width`,Value:`32`}),_(t(h),{Property:`Height`,Value:`32`})]),_:1}),_(t(S),{TargetType:`Button`},{default:r(()=>[_(t(h),{Property:`Padding`,Value:`0`}),_(t(h),{Property:`MinWidth`,Value:`0`}),_(t(h),{Property:`MinHeight`,Value:`0`}),_(t(h),{Property:`Margin`,Value:`6`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text18, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Red`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Red`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text19, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Orange`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Orange`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text20, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Yellow`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Yellow`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text21, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Green`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Green`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text22, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Blue`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Blue`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text23, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Indigo`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Indigo`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text24, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Violet`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Violet`})]),_:1})]),_:1}),_(T,{"AutomationProperties.Name":`{x:Bind Labels.Text25, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Gray`},{default:r(()=>[_(T.Content,null,{default:r(()=>[_(P,{Fill:`Gray`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),_(k,{"x:Name":`editor`,Height:`200`,MinWidth:`300`,"AutomationProperties.Name":`{x:Bind Labels.Text26, Mode=OneWay}`,GotFocus:`Editor_GotFocus`,"RelativePanel.AlignLeftWithPanel":`True`,"RelativePanel.AlignRightWithPanel":`True`,"RelativePanel.Below":`openFileButton`,TextChanged:`Editor_TextChanged`}),_(D,{Margin:`0,10,0,0`,Orientation:`Horizontal`,"RelativePanel.AlignLeftWith":`editor`,"RelativePanel.Below":`editor`},{default:r(()=>[_(b,{"x:Name":`findBoxLabel`,Margin:`0,0,0,4`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Text27, Mode=OneWay}`}),_(oe,{"x:Name":`findBox`,Width:`224`,Margin:`10,0,0,0`,GotFocus:`{x:Bind FindBoxHighlightMatches}`,LostFocus:`{x:Bind FindBoxRemoveHighlights}`,PlaceholderText:`{x:Bind Labels.Text28, Mode=OneWay}`,TextChanged:`{x:Bind FindBoxHighlightMatches}`})]),_:1})]),_:1})]),_:1}),_(j.Output),_(j.Options)]),_:1}),_(j,{"x:Name":`MathModeExample`,SampleDefinition:`RichEditBox\\RichEditBoxMath.txt`,HeaderText:`{x:Bind Labels.Header3, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[3].Xaml}`,CSharp:`{x:Bind Sources[3].CSharp}`},{default:r(()=>[_(j.Example,null,{default:r(()=>[_(D,{Spacing:`8`},{default:r(()=>[_(F,null,{default:r(()=>[_(t(w),{Margin:`0,0,0,4`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text30, Mode=OneWay}`})]),_:1}),_(t(w),{Margin:`0,0,0,4`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text31, Mode=OneWay}`}),_(t(p),{NavigateUri:`https://www.unicode.org/notes/tn28/`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text32, Mode=OneWay}`})]),_:1}),_(t(y),{Text:`{x:Bind Labels.Text33, Mode=OneWay}`})]),_:1}),_(t(w),{Margin:`0,0,0,4`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text34, Mode=OneWay}`})]),_:1}),_(t(w),null,{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text35, Mode=OneWay}`})]),_:1})]),_:1}),_(k,{"x:Name":`MathEditor`,Height:`80`,Width:`724`,FontSize:`16`,HorizontalAlignment:`Left`})]),_:1})]),_:1}),_(j.Output),_(j.Options)]),_:1}),_(j,{SampleDefinition:`RichEditBox\\WorkingMathmlRicheditbox.txt`,HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.Header4, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[4].Xaml}`,CSharp:`{x:Bind Sources[4].CSharp}`},{default:r(()=>[_(j.Example,null,{default:r(()=>[_(D,{Spacing:`16`},{default:r(()=>[_(F,null,{default:r(()=>[_(t(w),{Margin:`0,0,0,4`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text37, Mode=OneWay}`}),_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text38, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text39, Mode=OneWay}`}),_(t(p),{NavigateUri:`https://www.w3.org/Math/`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text40, Mode=OneWay}`})]),_:1}),_(t(y),{Text:`{x:Bind Labels.Text41, Mode=OneWay}`}),_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text42, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text43, Mode=OneWay}`})]),_:1}),_(t(w),{Margin:`0,0,0,4`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text44, Mode=OneWay}`}),_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text45, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text46, Mode=OneWay}`}),_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text47, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text48, Mode=OneWay}`})]),_:1}),_(t(w),{Margin:`0,0,0,4`},{default:r(()=>[_(t(y),{Text:`{x:Bind Labels.Text49, Mode=OneWay}`}),_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text50, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text51, Mode=OneWay}`}),_(t(y),{FontFamily:`Consolas`,Text:`{x:Bind Labels.Text52, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text53, Mode=OneWay}`})]),_:1}),_(t(w),null,{default:r(()=>[_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text54, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text55, Mode=OneWay}`}),_(t(y),{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text56, Mode=OneWay}`}),_(t(y),{Text:`{x:Bind Labels.Text57, Mode=OneWay}`})]),_:1})]),_:1}),_(k,{"x:Name":`mathEditor2`,FontSize:`16`,Height:`80`,Width:`724`,HorizontalAlignment:`Left`,TextChanged:`mathEditor2_TextChanged`}),_(b,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text58, Mode=OneWay}`,Margin:`0,0,0,-8`}),_(C,{MaxHeight:`450`,HorizontalScrollMode:`Disabled`,VerticalScrollMode:`Auto`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,CornerRadius:`4`,HorizontalAlignment:`Stretch`,Padding:`0,8,8,0`},{default:r(()=>[_(A,{"x:Name":`MathmlPresenter`,SampleType:`XAML`,Code:`{x:Bind MathmlCode, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),_(j.Output),_(j.Options,null,{default:r(()=>[_(D,null,{default:r(()=>[_(T,{"x:Name":`SetMathmlFormulaBtn`,Click:`SetMathmlFormulaBtn_Click`,Content:`{x:Bind Labels.Text59, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}},[[`__scopeId`,`data-v-9f61f2ce`]]);export{U as default};