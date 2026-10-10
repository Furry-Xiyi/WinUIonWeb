import{Fi as e,I as t,Ti as n,Ui as r,Wi as i,Wt as a,Y as o,a as s,ai as c,di as l,et as u,hi as d,ii as f,o as p,or as m,ri as h,t as g,wi as _,xt as v}from"./ScrollViewer-PoO_ma9Z.js";import{t as y}from"./Button-DjU0urmJ.js";import{t as b}from"./Image-Bse8ORbC.js";import{t as x}from"./StackPanel-CT7pl8zy.js";import{t as S}from"./ToggleButton-DwmhXZge.js";import{t as C}from"./ControlExample-C1ahTZEr.js";import{t as w}from"./pageState-BN3kXI7L.js";var T=`--- header
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
`,E={__name:`CommandBarFlyoutPage`,setup(e,{expose:a}){a();let{t:c}=u(),l=d(`currentPage`),{isFavoriteState:f,pageTheme:_,toggleTheme:E,toggleFavorite:D}=w(l?.value||`commandbarflyout`),O=i({});n(m,O);let k=h(()=>({PageTitle:c(`text.commandbarflyout`),Description:c(`text.the-commandbarflyout-lets-you-provide-users-with`),ToggleTheme:c(`gallery.page-header.toggle-theme`),Header:c(`sample.commandbarflyout.object`),Share:c(`text.share`),Save:c(`text.save`),Delete:c(`text.delete`),Resize:c(`sample.commandbarflyout.resize`),Move:c(`sample.commandbarflyout.move`),ImageHint:c(`sample.commandbarflyout.open-hint`),Mountain:c(`sample.commandbarflyout.mountain`)})),A=h(()=>c(f.value?`gallery.remove-favorite`:`gallery.add-favorite`)),j=h(()=>f.value?``:``),M=r(``),N=e=>{M.value=e?.Label||``},P=h(()=>M.value?c(`sample.you-clicked`,{name:M.value}):``),F=e=>O.CommandBarFlyout1?.ShowAt(O.Image1,{ShowMode:e?`Transient`:`Standard`,Placement:`RightEdgeAlignedTop`}),I={t:c,currentPage:l,isFavoriteState:f,pageTheme:_,toggleTheme:E,toggleFavorite:D,Names:O,Labels:k,FavoriteLabel:A,FavoriteGlyph:j,clickedLabel:M,OnElementClicked:N,SelectedOptionOutput:P,ShowMenu:F,MyImageButton_Click:()=>F(!0),MyImageButton_ContextRequested:(e,t)=>{F(!1),t&&(t.Handled=!0)},CommandBarFlyoutXaml:`--- header
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
`.split(`--- xaml`)[1]?.split(/\r?\n--- /)[0].trim()??``,CommandBarFlyoutCSharp:`--- header
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
`.split(`--- c#`)[1]?.split(/\r?\n--- /)[0].trim()??``,computed:h,inject:d,provide:n,ref:r,shallowReactive:i,AppBarButton:v,Button:y,CommandBarFlyout:o,ControlExample:C,FontIcon:s,Image:b,Page:t,ScrollViewer:g,StackPanel:x,TextBlock:p,ToggleButton:S,get useI18n(){return u},get xamlNameScopeKey(){return m},get createPageState(){return w},get commandBarFlyoutDefinition(){return T}};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(t,n,r,i,a,o){return _(),c(i.Page,null,{default:e(()=>[l(i.Page.Resources,null,{default:e(()=>[l(i.CommandBarFlyout,{"x:Name":`CommandBarFlyout1`,Placement:`Right`},{default:e(()=>[l(i.CommandBarFlyout.PrimaryCommands,null,{default:e(()=>[l(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Share`,Label:`{x:Bind Labels.Share, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Share, Mode=OneWay}`}),l(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Save`,Label:`{x:Bind Labels.Save, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Save, Mode=OneWay}`}),l(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Delete`,Label:`{x:Bind Labels.Delete, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1}),l(i.CommandBarFlyout.SecondaryCommands,null,{default:e(()=>[l(i.AppBarButton,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Resize, Mode=OneWay}`}),l(i.AppBarButton,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Move, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),l(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[f(`div`,D,[f(`div`,O,[l(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),l(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(`div`,k,[l(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[l(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),l(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[l(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),l(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[l(i.ControlExample,{class:`commandbar-flyout-example`,SampleDefinition:`CommandBarFlyout\\CommandbarflyoutCommandsAppObject.txt`,HeaderText:`{x:Bind Labels.Header, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CommandBarFlyoutXaml}`,CSharp:`{x:Bind CommandBarFlyoutCSharp}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.StackPanel,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind Labels.ImageHint, Mode=OneWay}`,TextWrapping:`Wrap`}),l(i.Button,{"x:Name":`myImageButton`,Margin:`0,12`,Padding:`0`,"AutomationProperties.Name":`{x:Bind Labels.Mountain, Mode=OneWay}`,Click:`MyImageButton_Click`,ContextRequested:`MyImageButton_ContextRequested`},{default:e(()=>[l(i.Image,{"x:Name":`Image1`,Height:`300`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{"x:Name":`SelectedOptionText`,Text:`{x:Bind SelectedOptionOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),l(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var j=a(E,[[`render`,A],[`__scopeId`,`data-v-6f056a2a`],[`__file`,`CommandBarFlyoutPage.vue`]]);export{j as default};