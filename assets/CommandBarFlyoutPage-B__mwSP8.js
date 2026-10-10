import{Ai as e,Bi as t,Cn as n,Ji as r,Mn as i,P as a,Yi as o,a as s,bi as c,c as l,ci as u,dr as d,gi as f,ki as p,li as m,o as h,p as g,t as _,ui as v}from"./ScrollViewer-B43ymvAj.js";import{t as y}from"./Button-B49t7g4C.js";import{t as b}from"./Image-DEHWrAx2.js";import{t as x}from"./StackPanel-Dy6dKYi5.js";import{t as S}from"./ToggleButton-DDZy2gVz.js";import{t as C}from"./ControlExample-Ddvmn5_c.js";import{t as w}from"./pageState-BQHW0me4.js";var T=`--- header
CommandBarFlyout for commands on an in-app object
--- xaml
<Page.Resources>
    <CommandBarFlyout Placement="Right" x:Name="CommandBarFlyout1">
        <AppBarButton Label="Share" Icon="Share" ToolTipService.ToolTip="Share" Click="OnElementClicked" />
        <AppBarButton Label="Save" Icon="Save" ToolTipService.ToolTip="Save" Click="OnElementClicked" />
        <AppBarButton Label="Delete" Icon="Delete" ToolTipService.ToolTip="Delete" Click="OnElementClicked" />
        <CommandBarFlyout.SecondaryCommands>
            <AppBarButton x:Name="ResizeButton1" Label="Resize" Click="OnElementClicked" />
            <AppBarButton x:Name="MoveButton1" Label="Move" Click="OnElementClicked" />
        </CommandBarFlyout.SecondaryCommands>
    </CommandBarFlyout>
</Page.Resources>

<Button x:Name="myImageButton" AutomationProperties.Name="mountain" Padding="0"
    Click="MyImageButton_Click" ContextRequested="MyImageButton_ContextRequested" >
    <Image x:Name="Image1" Height="300" Source="/Assets/SampleMedia/rainier.jpg"/>
</Button>
--- c#
private void ShowMenu(bool isTransient)
{
    FlyoutShowOptions myOption = new FlyoutShowOptions();
    myOption.ShowMode = isTransient ? FlyoutShowMode.Transient : FlyoutShowMode.Standard;
    CommandBarFlyout1.ShowAt(Image1, myOption);
}

private void MyImageButton_ContextRequested(Microsoft.UI.Xaml.UIElement sender, ContextRequestedEventArgs args)
{
    // Show a context menu in standard mode
    // Focus will move to the menu
    ShowMenu(false);
}

private void MyImageButton_Click(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
{
    // Show a context menu in transient mode
    // Focus will not move to the menu
    ShowMenu(true);
}
`,E={class:`gallery-item-page`},D={class:`page-heading`},O={class:`page-header-actions`},k=i({__name:`CommandBarFlyoutPage`,setup(i){let{t:k}=g(),{isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N}=w(c(`currentPage`)?.value||`commandbarflyout`);e(d,o({})),u(()=>({PageTitle:k(`text.commandbarflyout`),Description:k(`text.the-commandbarflyout-lets-you-provide-users-with`),ToggleTheme:k(`gallery.page-header.toggle-theme`),Header:k(`sample.commandbarflyout.object`),Share:k(`text.share`),Save:k(`text.save`),Delete:k(`text.delete`),Resize:k(`sample.commandbarflyout.resize`),Move:k(`sample.commandbarflyout.move`),ImageHint:k(`sample.commandbarflyout.open-hint`),Mountain:k(`sample.commandbarflyout.mountain`)})),u(()=>k(A.value?`gallery.remove-favorite`:`gallery.add-favorite`)),u(()=>A.value?``:``);let P=r(``);return u(()=>P.value?k(`sample.you-clicked`,{name:P.value}):``),T.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim(),T.split(`--- c#`)[1]?.split(/\r?\n--- /)[0].trim(),(e,r)=>(p(),v(n,null,{default:t(()=>[f(n.Resources,null,{default:t(()=>[f(l,{"x:Name":`CommandBarFlyout1`,Placement:`Right`},{default:t(()=>[f(l.PrimaryCommands,null,{default:t(()=>[f(a,{Click:`OnElementClicked`,Icon:`Share`,Label:`{x:Bind Labels.Share, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Share, Mode=OneWay}`}),f(a,{Click:`OnElementClicked`,Icon:`Save`,Label:`{x:Bind Labels.Save, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Save, Mode=OneWay}`}),f(a,{Click:`OnElementClicked`,Icon:`Delete`,Label:`{x:Bind Labels.Delete, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1}),f(l.SecondaryCommands,null,{default:t(()=>[f(a,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Resize, Mode=OneWay}`}),f(a,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Move, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),f(_,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[m(`div`,E,[m(`div`,D,[f(h,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),f(h,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(`div`,O,[f(y,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[f(s,{Glyph:``,FontSize:`16`})]),_:1}),f(S,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[f(s,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),f(x,{class:`gallery-page-content`},{default:t(()=>[f(C,{class:`commandbar-flyout-example`,SampleDefinition:`CommandBarFlyout\\CommandbarflyoutCommandsAppObject.txt`,HeaderText:`{x:Bind Labels.Header, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CommandBarFlyoutXaml}`,CSharp:`{x:Bind CommandBarFlyoutCSharp}`},{default:t(()=>[f(C.Example,null,{default:t(()=>[f(x,null,{default:t(()=>[f(h,{Text:`{x:Bind Labels.ImageHint, Mode=OneWay}`,TextWrapping:`Wrap`}),f(y,{"x:Name":`myImageButton`,Margin:`0,12`,Padding:`0`,"AutomationProperties.Name":`{x:Bind Labels.Mountain, Mode=OneWay}`,Click:`MyImageButton_Click`,ContextRequested:`MyImageButton_ContextRequested`},{default:t(()=>[f(b,{"x:Name":`Image1`,Height:`300`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`})]),_:1})]),_:1})]),_:1}),f(C.Output,null,{default:t(()=>[f(h,{"x:Name":`SelectedOptionText`,Text:`{x:Bind SelectedOptionOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),f(C.Options)]),_:1})]),_:1})])]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-6f056a2a`]]);export{k as default};