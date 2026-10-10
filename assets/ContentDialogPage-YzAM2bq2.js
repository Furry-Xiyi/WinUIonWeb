import{Bi as e,Ji as t,Mn as n,_i as r,bi as i,ci as a,gi as o,ki as s,o as c,p as l,t as u,ui as d}from"./ScrollViewer-B43ymvAj.js";import{t as f}from"./Button-B49t7g4C.js";import{t as p}from"./StackPanel-Dy6dKYi5.js";import{t as m}from"./ToggleButton-DDZy2gVz.js";import{t as h}from"./ControlExample-Ddvmn5_c.js";import{t as g}from"./CheckBox-fVMk0wr2.js";import{t as _}from"./ContentDialog-BljMl00e.js";import{t as v}from"./pageState-BQHW0me4.js";var y=`--- header
A basic content dialog with content.
--- xaml
<Page
    x:Class="WinUIGallery.ControlPages.ContentDialogContent"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <StackPanel VerticalAlignment="Stretch" HorizontalAlignment="Stretch">
        <!-- Content body -->
        <TextBlock Text="Lorem ipsum dolor sit amet, adipisicing elit." TextWrapping="Wrap" />
        <CheckBox Content="Upload your content to the cloud."/>
    </StackPanel>

</Page>
--- c#
private async void ShowDialog_Click(object sender, RoutedEventArgs e)
{
    ContentDialog dialog = new ContentDialog();

    // XamlRoot must be set in the case of a ContentDialog running in a Desktop app
    dialog.XamlRoot = this.XamlRoot;
    dialog.Style = Application.Current.Resources["DefaultContentDialogStyle"] as Style;
    dialog.Title = "Save your work?";
    dialog.PrimaryButtonText = "Save";
    dialog.SecondaryButtonText = "Don't Save";
    dialog.CloseButtonText = "Cancel";
    dialog.DefaultButton = ContentDialogButton.Primary;
    dialog.Content = new ContentDialogContent();

    var result = await dialog.ShowAsync();
}
`,b=`--- header
A content dialog without a default button.
--- xaml
<Page
    x:Class="WinUIGallery.ControlPages.ContentDialogContent"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <StackPanel VerticalAlignment="Stretch" HorizontalAlignment="Stretch">
        <!-- Content body -->
        <TextBlock Text="Lorem ipsum dolor sit amet, adipisicing elit." TextWrapping="Wrap" />
        <CheckBox Content="Upload your content to the cloud."/>
    </StackPanel>

</Page>
--- c#
private async void ShowDialogNoDefault_Click(object sender, RoutedEventArgs e)
{
    ContentDialog dialog = new ContentDialog();

    // XamlRoot must be set in the case of a ContentDialog running in a Desktop app
    dialog.XamlRoot = this.XamlRoot;
    dialog.Title = "Replace file?";
    dialog.PrimaryButtonText = "Replace";
    dialog.SecondaryButtonText = "Keep";
    dialog.CloseButtonText = "Cancel";
    dialog.DefaultButton = ContentDialogButton.None;
    dialog.Content = new ContentDialogContent();

    var result = await dialog.ShowAsync();
}
`,x=n(r({__name:`ContentDialogPage`,setup(n){let r=e=>{let t={},n=``;for(let r of e.split(/\r?\n/)){let e=r.match(/^---\s+(.+?)\s*$/);e?(n=e[1].toLowerCase(),t[n]=[]):n&&t[n].push(r)}return{xaml:(t.xaml??[]).join(`
`).trim(),cSharp:(t[`c#`]??[]).join(`
`).trim()}};r(y),r(b);let{t:x}=l();x(`text.contentdialog`),x(`text.use-a-contentdialog-to-show-relevant-information`),x(`text.a-basic-content-dialog-with-content`),x(`sample.contentdialog.no-default`),x(`text.show-dialog`),x(`sample.contentdialog.show-no-default`),x(`sample.contentdialog.save-title`),x(`sample.contentdialog.replace-title`),x(`sample.contentdialog.save`),x(`sample.contentdialog.dont-save`),x(`sample.contentdialog.cancel`),x(`sample.contentdialog.replace`),x(`sample.contentdialog.keep`),x(`sample.contentdialog.body`),x(`sample.contentdialog.upload`),x(`gallery.page-header.toggle-theme`),x(`gallery.page-header.favorite`);let S=i(`currentPage`),{isFavoriteState:C,pageTheme:w,toggleTheme:T,toggleFavorite:E}=v(a(()=>S?.value||`contentdialog`).value);return a(()=>C.value?``:``),t(``),t(``),(t,n)=>(s(),d(u,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[o(p,{class:`gallery-item-page`},{default:e(()=>[o(p,{class:`page-heading`},{default:e(()=>[o(c,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),o(c,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),o(p,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[o(f,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeLabel, Mode=OneWay}`},{default:e(()=>[o(c,{class:`icon`,Text:``})]),_:1}),o(m,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:e(()=>[o(c,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),o(p,{class:`gallery-page-content`},{default:e(()=>[o(h,{"x:Name":`Example1`,SampleDefinition:`ContentDialog\\BasicContentDialogContent.txt`,HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind basicSample.cSharp, Mode=OneWay}`},{default:e(()=>[o(h.Example,null,{default:e(()=>[o(p,{class:`contentdialog-example-row`,Orientation:`Horizontal`},{default:e(()=>[o(f,{"x:Name":`ShowDialog`,Click:`ShowDialog_Click`,Content:`{x:Bind showDialogText, Mode=OneWay}`}),o(c,{"x:Name":`DialogResult`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind dialogResult, Mode=OneWay}`,"aria-live":`polite`,"aria-atomic":`true`})]),_:1})]),_:1}),o(h.Output),o(h.Options)]),_:1}),o(h,{"x:Name":`Example2`,SampleDefinition:`ContentDialog\\ContentDialogWithoutDefault.txt`,HeaderText:`{x:Bind noDefaultHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind noDefaultSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind noDefaultSample.cSharp, Mode=OneWay}`},{default:e(()=>[o(h.Example,null,{default:e(()=>[o(p,{class:`contentdialog-example-row`,Orientation:`Horizontal`},{default:e(()=>[o(f,{"x:Name":`ShowDialogNoDefault`,Click:`ShowDialogNoDefault_Click`,Content:`{x:Bind showNoDefaultText, Mode=OneWay}`}),o(c,{"x:Name":`DialogResultNoDefault`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind dialogResultNoDefault, Mode=OneWay}`,"aria-live":`polite`,"aria-atomic":`true`})]),_:1})]),_:1}),o(h.Output),o(h.Options)]),_:1})]),_:1}),o(_,{"x:Name":`SaveDialog`,Loaded:`SaveDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Style:`{StaticResource DefaultContentDialogStyle}`,Title:`{x:Bind saveTitle, Mode=OneWay}`,PrimaryButtonText:`{x:Bind saveText, Mode=OneWay}`,SecondaryButtonText:`{x:Bind dontSaveText, Mode=OneWay}`,CloseButtonText:`{x:Bind cancelText, Mode=OneWay}`,DefaultButton:`Primary`},{default:e(()=>[o(p,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Stretch`},{default:e(()=>[o(c,{Text:`{x:Bind contentText, Mode=OneWay}`,TextWrapping:`Wrap`}),o(g,{Content:`{x:Bind uploadText, Mode=OneWay}`})]),_:1})]),_:1}),o(_,{"x:Name":`ReplaceDialog`,Loaded:`ReplaceDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Style:`{StaticResource DefaultContentDialogStyle}`,Title:`{x:Bind replaceTitle, Mode=OneWay}`,PrimaryButtonText:`{x:Bind replaceText, Mode=OneWay}`,SecondaryButtonText:`{x:Bind keepText, Mode=OneWay}`,CloseButtonText:`{x:Bind cancelText, Mode=OneWay}`,DefaultButton:`None`},{default:e(()=>[o(p,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Stretch`},{default:e(()=>[o(c,{Text:`{x:Bind contentText, Mode=OneWay}`,TextWrapping:`Wrap`}),o(g,{Content:`{x:Bind uploadText, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-124850b3`]]);export{x as default};