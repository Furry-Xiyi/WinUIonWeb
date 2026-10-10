import{$ as e,Ai as t,Bi as n,Cn as ee,Ei as r,Ji as i,Li as a,Mn as o,Ni as s,P as c,Sr as te,Yi as l,a as ne,at as re,bi as u,ci as d,dr as f,fn as ie,fr as p,gi as m,ki as h,mt as ae,o as oe,p as g,pn as se,t as ce,ui as _,ut as le,yi as v}from"./ScrollViewer-CHNE18MA.js";import{t as ue}from"./Button-DO0TiUOq.js";import{t as de}from"./Flyout-8D4iwnYI.js";import{t as y}from"./TextBox-DVeqZNbk.js";import{t as b}from"./DropDownButton-COUmYCC8.js";import{t as fe}from"./StackPanel-C60XOD66.js";import{t as pe}from"./ToggleButton-ZsjZg8Nu.js";import{t as me}from"./RichEditBox-DUL777MD.js";import{n as he,t as ge}from"./ControlExample-BKyw2NwY.js";import{t as _e}from"./RelativePanel-DvuI7NfM.js";import{t as ve}from"./VariableSizedWrapGrid-rjrhIrGq.js";import{t as ye}from"./Rectangle-BEFL2Zt7.js";import{t as be}from"./RichTextBlock-BsOcFqwR.js";import{t as x}from"./pageState-Djrh7EdY.js";import{t as S}from"./StandardUICommand-ixkrVWN7.js";var C=`--- header
A simple text editor using RichEditBox.
--- xaml
<RichEditBox x:Name="editor" AutomationProperties.Name="simple text editor"/>`,w=`--- header
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
}`,T=`--- header
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
}`,E=`--- header
Rich edit box in math mode
--- xaml
<RichEditBox x:Name="mathEditor" FontSize="16" />
--- c#
mathEditor.TextDocument.SetMathMode(RichEditMathMode.MathOnly);`,D=`--- header
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
}`,O={__name:`RichEditBoxPage`,setup(n,{expose:o}){o();let{t:s}=g(),m=u(`currentPage`),{isFavoriteState:h,pageTheme:_,toggleTheme:O,toggleFavorite:k}=x(m?.value||`richeditbox`),A=l({});t(f,A);let j=d(()=>({Title:s(`text.richeditbox`),Description:s(`text.the-richeditbox-control-lets-a-user-enter-format`),ToggleTheme:s(`gallery.page-header.toggle-theme`),Header0:s(`text.a-simple-text-editor-with-richeditbox`),Text4:s(`TextControls.RichEditBox.Label1`),Header1:s(`sample.richeditbox.custom-command-flyout`),Text6:s(`TextControls.RichEditBox.Label2`),Header2:s(`sample.richeditbox.custom-formatting-editor`),Text8:s(`sample.richeditbox.open-file`),Text9:s(`sample.richeditbox.open-file`),Text10:s(`sample.richeditbox.save-file`),Text11:s(`sample.richeditbox.save-file`),Text12:s(`sample.richeditbox.bold`),Text13:s(`sample.richeditbox.bold`),Text14:s(`sample.richeditbox.italic`),Text15:s(`sample.richeditbox.italic`),Text16:s(`sample.splitbutton.font-color`),Text17:s(`sample.splitbutton.font-color`),Text18:s(`text.red`),Text19:s(`sample.orange`),Text20:s(`text.yellow`),Text21:s(`text.green`),Text22:s(`text.blue`),Text23:s(`sample.indigo`),Text24:s(`sample.violet`),Text25:s(`sample.gray`),Text26:s(`sample.richeditbox.custom-editor`),Text27:s(`sample.richeditbox.find-label`),Text28:s(`sample.richeditbox.search-placeholder`),Header3:s(`sample.richeditbox.math-mode`),Text30:s(`sample.richeditbox.math-note`),Text31:s(`TextControls.RichEditBox.Label3`),Text32:s(`TextControls.RichEditBox.Label4`),Text33:s(`TextControls.RichEditBox.Label5`),Text34:s(`sample.richeditbox.math-example`),Text35:s(`TextControls.RichEditBox.Label6`),Header4:s(`sample.richeditbox.mathml`),Text37:s(`TextControls.RichEditBox.Label7`),Text38:s(`TextControls.RichEditBox.Label8`),Text39:s(`TextControls.RichEditBox.Label9`),Text40:s(`TextControls.RichEditBox.Label10`),Text41:s(`TextControls.RichEditBox.Label11`),Text42:s(`text.richeditbox`),Text43:s(`TextControls.RichEditBox.Label12`),Text44:s(`TextControls.RichEditBox.Label13`),Text45:s(`TextControls.RichEditBox.Label14`),Text46:s(`TextControls.RichEditBox.Label15`),Text47:s(`text.richeditbox`),Text48:s(`TextControls.RichEditBox.Label16`),Text49:s(`TextControls.RichEditBox.Label17`),Text50:s(`text.richeditbox`),Text51:s(`TextControls.RichEditBox.Label18`),Text52:s(`TextControls.RichEditBox.Label19`),Text53:s(`TextControls.RichEditBox.Label20`),Text54:s(`TextControls.RichEditBox.Label21`),Text55:s(`TextControls.RichEditBox.Label22`),Text56:s(`TextControls.RichEditBox.Label23`),Text57:s(`TextControls.RichEditBox.Label24`),Text58:s(`sample.richeditbox.mathml-code`),Text59:s(`sample.richeditbox.set-sample-formula`)})),M=d(()=>s(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=d(()=>h.value?``:``),P=[C,w,T,E,D].map(e=>({Xaml:e.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim()??``,CSharp:e.split(/^--- c#\r?\n/m)[1]?.trim()??``})),F=()=>{let e=document.createElement(`input`);e.type=`file`,e.accept=`.rtf`,e.addEventListener(`change`,async()=>{let t=e.files?.[0];t&&await A.editor.Document.LoadFromStream(`FormatRtf`,t)},{once:!0}),e.click()},I=()=>{let e=A.editor.Document.SaveToStream(`FormatRtf`),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`${s(`TextControls.RichEditBox.NewDocument`)}.rtf`,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)},L=()=>{A.editor.Document.Selection.CharacterFormat.Bold=`Toggle`},R=()=>{A.editor.Document.Selection.CharacterFormat.Italic=`Toggle`},z=`Green`,B=!1,V=e=>{let t=e.Content?.Fill??e.CommandParameter;typeof t==`string`&&(z=t,A.editor.Document.Selection.CharacterFormat.ForegroundColor=t,A.fontColorButton.Flyout.Hide(),A.editor.Focus(`Keyboard`))},H=()=>{if(!A.editor)return;let e=A.editor.Document.GetRange(0,2**53-1);B=!0;try{e.CharacterFormat.BackgroundColor=A.editor.Background,e.CharacterFormat.ForegroundColor=A.editor.Foreground}finally{B=!1}},U=()=>{H();let e=A.findBox?.Text??``;if(!e)return;let t=A.editor.Document.GetRange(0,0);B=!0;try{for(;t.FindText(e,2**53-1,`None`)>0;)t.CharacterFormat.BackgroundColor=`Highlight`,t.CharacterFormat.ForegroundColor=`HighlightText`}finally{B=!1}},W=()=>{if(A.editor){B=!0;try{A.editor.Document.GetRange(0,2**53-1).CharacterFormat.BackgroundColor=A.editor.Background}finally{B=!1}}},G=()=>{if(!(B||!A.editor)){B=!0;try{A.editor.Document.Selection.CharacterFormat.ForegroundColor=z}finally{B=!1}}},K=new S(`Share`),q=e=>{e.Target!==A.REBCustom||e.PrimaryCommands.some(e=>e.key===`Share`)||e.PrimaryCommands.push(v(c,{key:`Share`,Command:K}))},J=e=>{e.SelectionFlyout.addEventListener(`Opening`,q),e.ContextFlyout.addEventListener(`Opening`,q)},Y=e=>{e.SelectionFlyout.removeEventListener(`Opening`,q),e.ContextFlyout.removeEventListener(`Opening`,q)},X=i(``),Z=e=>{e.Document.GetMathMode()===`MathOnly`&&(X.value=e.Document.GetMathML()||s(`TextControls.NoMathML`))},Q=()=>{A.mathEditor2.Document.SetMathML(`<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi><mo>∈</mo><mi>P</mi><mfenced><mrow><mi>A</mi></mrow></mfenced><mo>↔</mo><mi>x</mi><mo>⊆</mo><mi>A</mi></math>`)};r(()=>{A.MathEditor.Document.SetMathMode(`MathOnly`),A.mathEditor2.Document.SetMathMode(`MathOnly`),X.value=s(`TextControls.NoMathML`)}),a(()=>s(`TextControls.NoMathML`),e=>{A.mathEditor2?.Document.GetMathML()||(X.value=e)}),t(p,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:h,pageTheme:_,Sources:P,MathmlCode:X,toggleTheme:O,toggleFavorite:k,OpenButton_Click:F,SaveButton_Click:I,BoldButton_Click:L,ItalicButton_Click:R,ColorButton_Click:V,FindBoxHighlightMatches:U,FindBoxRemoveHighlights:H,Editor_GotFocus:W,Editor_TextChanged:G,REBCustom_Loaded:J,REBCustom_Unloaded:Y,mathEditor2_TextChanged:Z,SetMathmlFormulaBtn_Click:Q});let $={t:s,currentPage:m,isFavoriteState:h,pageTheme:_,toggleTheme:O,toggleFavorite:k,controls:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,Sources:P,OpenButton_Click:F,SaveButton_Click:I,BoldButton_Click:L,ItalicButton_Click:R,get currentColor(){return z},set currentColor(e){z=e},get updatingFormat(){return B},set updatingFormat(e){B=e},ColorButton_Click:V,FindBoxRemoveHighlights:H,FindBoxHighlightMatches:U,Editor_GotFocus:W,Editor_TextChanged:G,shareCommand:K,Menu_Opening:q,REBCustom_Loaded:J,REBCustom_Unloaded:Y,MathmlCode:X,mathEditor2_TextChanged:Z,SetMathmlFormulaBtn_Click:Q,computed:d,h:v,inject:u,onMounted:r,provide:t,ref:i,shallowReactive:l,watch:a,Button:ue,ToggleButton:pe,FontIcon:ne,ControlExample:ge,Page:ee,ScrollViewer:ce,StackPanel:fe,TextBlock:oe,TextBox:y,RichEditBox:me,RichTextBlock:be,RelativePanel:_e,DropDownButton:b,Flyout:de,VariableSizedWrapGrid:ve,Rectangle:ye,SymbolIcon:e,SampleCodePresenter:he,AppBarButton:c,get StandardUICommand(){return S},get Run(){return ae},get Hyperlink(){return re},get Paragraph(){return le},get Style(){return se},get Setter(){return ie},get ResourceDictionary(){return te},get xamlNameScopeKey(){return f},get xamlScopeKey(){return p},get useI18n(){return g},get createPageState(){return x},get Sample0(){return C},get Sample1(){return w},get Sample2(){return T},get Sample3(){return E},get Sample4(){return D}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function k(e,t,ee,r,i,a){let o=s(`StaticResource`);return h(),_(r.Page,{Theme:`{x:Bind pageTheme, Mode=OneWay}`},{default:n(()=>[m(r.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[m(r.StackPanel,{class:`gallery-item-page`},{default:n(()=>[m(r.StackPanel,{class:`page-heading`},{default:n(()=>[m(r.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`}),m(r.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(r.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[m(r.Button,{Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[m(r.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(r.ToggleButton,{IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[m(r.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),m(r.StackPanel,{class:`gallery-page-content`},{default:n(()=>[m(r.StackPanel,null,{default:n(()=>[m(r.ControlExample,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichEditBox\\SimpleTextEditorRicheditbox.txt`,HeaderText:`{x:Bind Labels.Header0, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[0].Xaml}`,CSharp:`{x:Bind Sources[0].CSharp}`},{default:n(()=>[m(r.ControlExample.Example,null,{default:n(()=>[m(r.RichEditBox,{"AutomationProperties.Name":`{x:Bind Labels.Text4, Mode=OneWay}`})]),_:1}),m(r.ControlExample.Output),m(r.ControlExample.Options)]),_:1}),m(r.ControlExample,{SampleDefinition:`RichEditBox\\CustomizingRicheditboxCommandbarflyoutAdding.txt`,HeaderText:`{x:Bind Labels.Header1, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[1].Xaml}`,CSharp:`{x:Bind Sources[1].CSharp}`},{default:n(()=>[m(r.ControlExample.Example,null,{default:n(()=>[m(r.RichEditBox,{"x:Name":`REBCustom`,Width:`800`,Height:`200`,"AutomationProperties.Name":`{x:Bind Labels.Text6, Mode=OneWay}`,Loaded:`REBCustom_Loaded`,Unloaded:`REBCustom_Unloaded`})]),_:1}),m(r.ControlExample.Output),m(r.ControlExample.Options)]),_:1}),m(r.ControlExample,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`RichEditBox\\CustomEditorRicheditbox.txt`,HeaderText:`{x:Bind Labels.Header2, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[2].Xaml}`,CSharp:`{x:Bind Sources[2].CSharp}`},{default:n(()=>[m(r.ControlExample.Example,null,{default:n(()=>[m(r.RelativePanel,{Margin:`0,0,0,20`,HorizontalAlignment:`Stretch`},{default:n(()=>[m(r.RelativePanel.Resources,null,{default:n(()=>[m(r.ResourceDictionary,null,{default:n(()=>[m(r.Style,{TargetType:`Button`},{default:n(()=>[m(r.Setter,{Property:`BorderThickness`,Value:`0`}),m(r.Setter,{Property:`Background`,Value:`Transparent`}),m(r.Setter,{Property:`Margin`,Value:`0,0,8,0`})]),_:1}),m(r.ResourceDictionary.ThemeDictionaries,null,{default:n(()=>[m(r.ResourceDictionary,{"x:Key":`HighContrast`},{default:n(()=>[m(o,{"x:Key":`ButtonBackgroundPointerOver`,ResourceKey:`SystemColorHighlightColor`})]),_:1})]),_:1})]),_:1})]),_:1}),m(r.Button,{"x:Name":`openFileButton`,"AutomationProperties.Name":`{x:Bind Labels.Text8, Mode=OneWay}`,Click:`OpenButton_Click`,"ToolTipService.ToolTip":`{x:Bind Labels.Text9, Mode=OneWay}`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.FontIcon,{Glyph:``})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text10, Mode=OneWay}`,Click:`SaveButton_Click`,"RelativePanel.RightOf":`openFileButton`,"ToolTipService.ToolTip":`{x:Bind Labels.Text11, Mode=OneWay}`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.FontIcon,{Glyph:``})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text12, Mode=OneWay}`,Click:`BoldButton_Click`,"RelativePanel.LeftOf":`italicButton`,"ToolTipService.ToolTip":`{x:Bind Labels.Text13, Mode=OneWay}`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.FontIcon,{Glyph:``})]),_:1})]),_:1}),m(r.Button,{"x:Name":`italicButton`,"AutomationProperties.Name":`{x:Bind Labels.Text14, Mode=OneWay}`,Click:`ItalicButton_Click`,"RelativePanel.LeftOf":`fontColorButton`,"ToolTipService.ToolTip":`{x:Bind Labels.Text15, Mode=OneWay}`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.FontIcon,{Glyph:``})]),_:1})]),_:1}),m(r.DropDownButton,{"x:Name":`fontColorButton`,"AutomationProperties.Name":`{x:Bind Labels.Text16, Mode=OneWay}`,Background:`Transparent`,BorderThickness:`0`,"RelativePanel.AlignRightWithPanel":`True`,"ToolTipService.ToolTip":`{x:Bind Labels.Text17, Mode=OneWay}`},{default:n(()=>[m(r.SymbolIcon,{Symbol:`FontColor`}),m(r.DropDownButton.Flyout,null,{default:n(()=>[m(r.Flyout,{Placement:`Bottom`},{default:n(()=>[m(r.VariableSizedWrapGrid,{MaximumRowsOrColumns:`3`,Orientation:`Horizontal`},{default:n(()=>[m(r.VariableSizedWrapGrid.Resources,null,{default:n(()=>[m(r.Style,{TargetType:`Rectangle`},{default:n(()=>[m(r.Setter,{Property:`Width`,Value:`32`}),m(r.Setter,{Property:`Height`,Value:`32`})]),_:1}),m(r.Style,{TargetType:`Button`},{default:n(()=>[m(r.Setter,{Property:`Padding`,Value:`0`}),m(r.Setter,{Property:`MinWidth`,Value:`0`}),m(r.Setter,{Property:`MinHeight`,Value:`0`}),m(r.Setter,{Property:`Margin`,Value:`6`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text18, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Red`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Red`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text19, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Orange`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Orange`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text20, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Yellow`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Yellow`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text21, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Green`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Green`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text22, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Blue`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Blue`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text23, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Indigo`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Indigo`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text24, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Violet`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Violet`})]),_:1})]),_:1}),m(r.Button,{"AutomationProperties.Name":`{x:Bind Labels.Text25, Mode=OneWay}`,Click:`ColorButton_Click`,CommandParameter:`Gray`},{default:n(()=>[m(r.Button.Content,null,{default:n(()=>[m(r.Rectangle,{Fill:`Gray`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(r.RichEditBox,{"x:Name":`editor`,Height:`200`,MinWidth:`300`,"AutomationProperties.Name":`{x:Bind Labels.Text26, Mode=OneWay}`,GotFocus:`Editor_GotFocus`,"RelativePanel.AlignLeftWithPanel":`True`,"RelativePanel.AlignRightWithPanel":`True`,"RelativePanel.Below":`openFileButton`,TextChanged:`Editor_TextChanged`}),m(r.StackPanel,{Margin:`0,10,0,0`,Orientation:`Horizontal`,"RelativePanel.AlignLeftWith":`editor`,"RelativePanel.Below":`editor`},{default:n(()=>[m(r.TextBlock,{"x:Name":`findBoxLabel`,Margin:`0,0,0,4`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Text27, Mode=OneWay}`}),m(r.TextBox,{"x:Name":`findBox`,Width:`224`,Margin:`10,0,0,0`,GotFocus:`{x:Bind FindBoxHighlightMatches}`,LostFocus:`{x:Bind FindBoxRemoveHighlights}`,PlaceholderText:`{x:Bind Labels.Text28, Mode=OneWay}`,TextChanged:`{x:Bind FindBoxHighlightMatches}`})]),_:1})]),_:1})]),_:1}),m(r.ControlExample.Output),m(r.ControlExample.Options)]),_:1}),m(r.ControlExample,{"x:Name":`MathModeExample`,SampleDefinition:`RichEditBox\\RichEditBoxMath.txt`,HeaderText:`{x:Bind Labels.Header3, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[3].Xaml}`,CSharp:`{x:Bind Sources[3].CSharp}`},{default:n(()=>[m(r.ControlExample.Example,null,{default:n(()=>[m(r.StackPanel,{Spacing:`8`},{default:n(()=>[m(r.RichTextBlock,null,{default:n(()=>[m(r.Paragraph,{Margin:`0,0,0,4`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text30, Mode=OneWay}`})]),_:1}),m(r.Paragraph,{Margin:`0,0,0,4`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text31, Mode=OneWay}`}),m(r.Hyperlink,{NavigateUri:`https://www.unicode.org/notes/tn28/`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text32, Mode=OneWay}`})]),_:1}),m(r.Run,{Text:`{x:Bind Labels.Text33, Mode=OneWay}`})]),_:1}),m(r.Paragraph,{Margin:`0,0,0,4`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text34, Mode=OneWay}`})]),_:1}),m(r.Paragraph,null,{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text35, Mode=OneWay}`})]),_:1})]),_:1}),m(r.RichEditBox,{"x:Name":`MathEditor`,Height:`80`,Width:`724`,FontSize:`16`,HorizontalAlignment:`Left`})]),_:1})]),_:1}),m(r.ControlExample.Output),m(r.ControlExample.Options)]),_:1}),m(r.ControlExample,{SampleDefinition:`RichEditBox\\WorkingMathmlRicheditbox.txt`,HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind Labels.Header4, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind Sources[4].Xaml}`,CSharp:`{x:Bind Sources[4].CSharp}`},{default:n(()=>[m(r.ControlExample.Example,null,{default:n(()=>[m(r.StackPanel,{Spacing:`16`},{default:n(()=>[m(r.RichTextBlock,null,{default:n(()=>[m(r.Paragraph,{Margin:`0,0,0,4`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text37, Mode=OneWay}`}),m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text38, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text39, Mode=OneWay}`}),m(r.Hyperlink,{NavigateUri:`https://www.w3.org/Math/`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text40, Mode=OneWay}`})]),_:1}),m(r.Run,{Text:`{x:Bind Labels.Text41, Mode=OneWay}`}),m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text42, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text43, Mode=OneWay}`})]),_:1}),m(r.Paragraph,{Margin:`0,0,0,4`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text44, Mode=OneWay}`}),m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text45, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text46, Mode=OneWay}`}),m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text47, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text48, Mode=OneWay}`})]),_:1}),m(r.Paragraph,{Margin:`0,0,0,4`},{default:n(()=>[m(r.Run,{Text:`{x:Bind Labels.Text49, Mode=OneWay}`}),m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text50, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text51, Mode=OneWay}`}),m(r.Run,{FontFamily:`Consolas`,Text:`{x:Bind Labels.Text52, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text53, Mode=OneWay}`})]),_:1}),m(r.Paragraph,null,{default:n(()=>[m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text54, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text55, Mode=OneWay}`}),m(r.Run,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text56, Mode=OneWay}`}),m(r.Run,{Text:`{x:Bind Labels.Text57, Mode=OneWay}`})]),_:1})]),_:1}),m(r.RichEditBox,{"x:Name":`mathEditor2`,FontSize:`16`,Height:`80`,Width:`724`,HorizontalAlignment:`Left`,TextChanged:`mathEditor2_TextChanged`}),m(r.TextBlock,{FontWeight:`SemiBold`,Text:`{x:Bind Labels.Text58, Mode=OneWay}`,Margin:`0,0,0,-8`}),m(r.ScrollViewer,{MaxHeight:`450`,HorizontalScrollMode:`Disabled`,VerticalScrollMode:`Auto`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,CornerRadius:`4`,HorizontalAlignment:`Stretch`,Padding:`0,8,8,0`},{default:n(()=>[m(r.SampleCodePresenter,{"x:Name":`MathmlPresenter`,SampleType:`XAML`,Code:`{x:Bind MathmlCode, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(r.ControlExample.Output),m(r.ControlExample.Options,null,{default:n(()=>[m(r.StackPanel,null,{default:n(()=>[m(r.Button,{"x:Name":`SetMathmlFormulaBtn`,Click:`SetMathmlFormulaBtn_Click`,Content:`{x:Bind Labels.Text59, Mode=OneWay}`,Style:`{StaticResource AccentButtonStyle}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var A=o(O,[[`render`,k],[`__scopeId`,`data-v-9f61f2ce`],[`__file`,`RichEditBoxPage.vue`]]);export{A as default};