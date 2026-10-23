import{Ei as e,Gi as t,Li as n,Wt as r,_i as i,ai as a,et as o,mi as s,o as c,pi as l,si as u,t as d}from"./ScrollViewer-BWDA_C78.js";import{t as f}from"./Button-BNDPNdYJ.js";import{t as p}from"./CheckBox-BArw_ebH.js";import{t as m}from"./ContentDialog-CoLzvISE.js";import{t as h}from"./StackPanel-sg_Bd5oB.js";import{t as g}from"./ToggleButton-HP5wmrvH.js";import{t as _}from"./ControlExample-CzGyf8u0.js";import{t as v}from"./pageState-CcJibQcm.js";var y=`--- header
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
`,x=s({__name:`ContentDialogPage`,setup(e,{expose:n}){n();let r=e=>{let t={},n=``;for(let r of e.split(/\r?\n/)){let e=r.match(/^---\s+(.+?)\s*$/);e?(n=e[1].toLowerCase(),t[n]=[]):n&&t[n].push(r)}return{xaml:(t.xaml??[]).join(`
`).trim(),cSharp:(t[`c#`]??[]).join(`
`).trim()}},s=r(y),l=r(b),{t:u}=o(),x=u(`text.contentdialog`),S=u(`text.use-a-contentdialog-to-show-relevant-information`),C=u(`text.a-basic-content-dialog-with-content`),w=u(`sample.contentdialog.no-default`),T=u(`text.show-dialog`),E=u(`sample.contentdialog.show-no-default`),D=u(`sample.contentdialog.save-title`),O=u(`sample.contentdialog.replace-title`),k=u(`sample.contentdialog.save`),A=u(`sample.contentdialog.dont-save`),j=u(`sample.contentdialog.cancel`),M=u(`sample.contentdialog.replace`),N=u(`sample.contentdialog.keep`),P=u(`sample.contentdialog.body`),F=u(`sample.contentdialog.upload`),I=u(`gallery.page-header.toggle-theme`),L=u(`gallery.page-header.favorite`),R=i(`currentPage`),z=a(()=>R?.value||`contentdialog`),{isFavoriteState:B,pageTheme:V,toggleTheme:H,toggleFavorite:U}=v(z.value),W=a(()=>B.value?``:``),G,K,q=e=>{G=e},J=e=>{K=e},Y=t(``),X=t(``),Z=!1,Q={parseSampleDefinition:r,basicSample:s,noDefaultSample:l,t:u,pageTitle:x,pageDescription:S,basicHeader:C,noDefaultHeader:w,showDialogText:T,showNoDefaultText:E,saveTitle:D,replaceTitle:O,saveText:k,dontSaveText:A,cancelText:j,replaceText:M,keepText:N,contentText:P,uploadText:F,themeLabel:I,favoriteLabel:L,currentPage:R,pageKey:z,isFavoriteState:B,pageTheme:V,toggleTheme:H,toggleFavorite:U,favoriteGlyph:W,get saveDialog(){return G},set saveDialog(e){G=e},get replaceDialog(){return K},set replaceDialog(e){K=e},SaveDialog_Loaded:q,ReplaceDialog_Loaded:J,dialogResult:Y,dialogResultNoDefault:X,get dialogPending(){return Z},set dialogPending(e){Z=e},ShowDialog_Click:async()=>{if(!(!G||Z)){Z=!0;try{let e=await G.ShowAsync();Y.value=u(e===`Primary`?`sample.contentdialog.saved`:e===`Secondary`?`sample.contentdialog.not-saved`:`sample.contentdialog.cancelled`)}finally{Z=!1}}},ShowDialogNoDefault_Click:async()=>{if(!(!K||Z)){Z=!0;try{let e=await K.ShowAsync();X.value=u(e===`Primary`?`sample.contentdialog.replaced`:e===`Secondary`?`sample.contentdialog.kept`:`sample.contentdialog.cancelled`)}finally{Z=!1}}},Button:f,CheckBox:p,ContentDialog:m,ControlExample:_,ScrollViewer:d,StackPanel:h,TextBlock:c,ToggleButton:g};return Object.defineProperty(Q,"__isScriptSetup",{enumerable:!1,value:!0}),Q}});function S(t,r,i,a,o,s){return e(),u(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[l(a.StackPanel,{class:`gallery-item-page`},{default:n(()=>[l(a.StackPanel,{class:`page-heading`},{default:n(()=>[l(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),l(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[l(a.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeLabel, Mode=OneWay}`},{default:n(()=>[l(a.TextBlock,{class:`icon`,Text:``})]),_:1}),l(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:n(()=>[l(a.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),l(a.StackPanel,{class:`gallery-page-content`},{default:n(()=>[l(a.ControlExample,{"x:Name":`Example1`,SampleDefinition:`ContentDialog\\BasicContentDialogContent.txt`,HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind basicSample.cSharp, Mode=OneWay}`},{default:n(()=>[l(a.ControlExample.Example,null,{default:n(()=>[l(a.StackPanel,{class:`contentdialog-example-row`,Orientation:`Horizontal`},{default:n(()=>[l(a.Button,{"x:Name":`ShowDialog`,Click:`ShowDialog_Click`,Content:`{x:Bind showDialogText, Mode=OneWay}`}),l(a.TextBlock,{"x:Name":`DialogResult`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind dialogResult, Mode=OneWay}`,"aria-live":`polite`,"aria-atomic":`true`})]),_:1})]),_:1}),l(a.ControlExample.Output),l(a.ControlExample.Options)]),_:1}),l(a.ControlExample,{"x:Name":`Example2`,SampleDefinition:`ContentDialog\\ContentDialogWithoutDefault.txt`,HeaderText:`{x:Bind noDefaultHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind noDefaultSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind noDefaultSample.cSharp, Mode=OneWay}`},{default:n(()=>[l(a.ControlExample.Example,null,{default:n(()=>[l(a.StackPanel,{class:`contentdialog-example-row`,Orientation:`Horizontal`},{default:n(()=>[l(a.Button,{"x:Name":`ShowDialogNoDefault`,Click:`ShowDialogNoDefault_Click`,Content:`{x:Bind showNoDefaultText, Mode=OneWay}`}),l(a.TextBlock,{"x:Name":`DialogResultNoDefault`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind dialogResultNoDefault, Mode=OneWay}`,"aria-live":`polite`,"aria-atomic":`true`})]),_:1})]),_:1}),l(a.ControlExample.Output),l(a.ControlExample.Options)]),_:1})]),_:1}),l(a.ContentDialog,{"x:Name":`SaveDialog`,Loaded:`SaveDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Style:`{StaticResource DefaultContentDialogStyle}`,Title:`{x:Bind saveTitle, Mode=OneWay}`,PrimaryButtonText:`{x:Bind saveText, Mode=OneWay}`,SecondaryButtonText:`{x:Bind dontSaveText, Mode=OneWay}`,CloseButtonText:`{x:Bind cancelText, Mode=OneWay}`,DefaultButton:`Primary`},{default:n(()=>[l(a.StackPanel,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Stretch`},{default:n(()=>[l(a.TextBlock,{Text:`{x:Bind contentText, Mode=OneWay}`,TextWrapping:`Wrap`}),l(a.CheckBox,{Content:`{x:Bind uploadText, Mode=OneWay}`})]),_:1})]),_:1}),l(a.ContentDialog,{"x:Name":`ReplaceDialog`,Loaded:`ReplaceDialog_Loaded`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`,Style:`{StaticResource DefaultContentDialogStyle}`,Title:`{x:Bind replaceTitle, Mode=OneWay}`,PrimaryButtonText:`{x:Bind replaceText, Mode=OneWay}`,SecondaryButtonText:`{x:Bind keepText, Mode=OneWay}`,CloseButtonText:`{x:Bind cancelText, Mode=OneWay}`,DefaultButton:`None`},{default:n(()=>[l(a.StackPanel,{HorizontalAlignment:`Stretch`,VerticalAlignment:`Stretch`},{default:n(()=>[l(a.TextBlock,{Text:`{x:Bind contentText, Mode=OneWay}`,TextWrapping:`Wrap`}),l(a.CheckBox,{Content:`{x:Bind uploadText, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})}var C=r(x,[[`render`,S],[`__scopeId`,`data-v-124850b3`],[`__file`,`ContentDialogPage.vue`]]);export{C as default};