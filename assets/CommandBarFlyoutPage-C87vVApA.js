import{Ai as e,Bi as t,Cn as n,Ji as r,Mn as i,P as a,Yi as o,a as s,bi as c,c as l,ci as u,dr as d,gi as f,ki as p,li as m,o as h,p as g,t as _,ui as v}from"./ScrollViewer-CHNE18MA.js";import{t as y}from"./Button-DO0TiUOq.js";import{t as b}from"./Image-BKiqvBIm.js";import{t as x}from"./StackPanel-C60XOD66.js";import{t as S}from"./ToggleButton-ZsjZg8Nu.js";import{t as C}from"./ControlExample-BKyw2NwY.js";import{t as w}from"./pageState-Djrh7EdY.js";var T=`--- header
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
`,E={__name:`CommandBarFlyoutPage`,setup(t,{expose:i}){i();let{t:f}=g(),p=c(`currentPage`),{isFavoriteState:m,pageTheme:v,toggleTheme:E,toggleFavorite:D}=w(p?.value||`commandbarflyout`),O=o({});e(d,O);let k=u(()=>({PageTitle:f(`text.commandbarflyout`),Description:f(`text.the-commandbarflyout-lets-you-provide-users-with`),ToggleTheme:f(`gallery.page-header.toggle-theme`),Header:f(`sample.commandbarflyout.object`),Share:f(`text.share`),Save:f(`text.save`),Delete:f(`text.delete`),Resize:f(`sample.commandbarflyout.resize`),Move:f(`sample.commandbarflyout.move`),ImageHint:f(`sample.commandbarflyout.open-hint`),Mountain:f(`sample.commandbarflyout.mountain`)})),A=u(()=>f(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),j=u(()=>m.value?``:``),M=r(``),N=e=>{M.value=e?.Label||``},P=u(()=>M.value?f(`sample.you-clicked`,{name:M.value}):``),F=e=>O.CommandBarFlyout1?.ShowAt(O.Image1,{ShowMode:e?`Transient`:`Standard`,Placement:`RightEdgeAlignedTop`}),I={t:f,currentPage:p,isFavoriteState:m,pageTheme:v,toggleTheme:E,toggleFavorite:D,Names:O,Labels:k,FavoriteLabel:A,FavoriteGlyph:j,clickedLabel:M,OnElementClicked:N,SelectedOptionOutput:P,ShowMenu:F,MyImageButton_Click:()=>F(!0),MyImageButton_ContextRequested:(e,t)=>{F(!1),t&&(t.Handled=!0)},CommandBarFlyoutXaml:`--- header
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
`.split(`--- c#`)[1]?.split(/\r?\n--- /)[0].trim()??``,computed:u,inject:c,provide:e,ref:r,shallowReactive:o,AppBarButton:a,Button:y,CommandBarFlyout:l,ControlExample:C,FontIcon:s,Image:b,Page:n,ScrollViewer:_,StackPanel:x,TextBlock:h,ToggleButton:S,get useI18n(){return g},get xamlNameScopeKey(){return d},get createPageState(){return w},get commandBarFlyoutDefinition(){return T}};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(e,n,r,i,a,o){return p(),v(i.Page,null,{default:t(()=>[f(i.Page.Resources,null,{default:t(()=>[f(i.CommandBarFlyout,{"x:Name":`CommandBarFlyout1`,Placement:`Right`},{default:t(()=>[f(i.CommandBarFlyout.PrimaryCommands,null,{default:t(()=>[f(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Share`,Label:`{x:Bind Labels.Share, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Share, Mode=OneWay}`}),f(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Save`,Label:`{x:Bind Labels.Save, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Save, Mode=OneWay}`}),f(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Delete`,Label:`{x:Bind Labels.Delete, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1}),f(i.CommandBarFlyout.SecondaryCommands,null,{default:t(()=>[f(i.AppBarButton,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Resize, Mode=OneWay}`}),f(i.AppBarButton,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Move, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),f(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[m(`div`,D,[m(`div`,O,[f(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),f(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(`div`,k,[f(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),f(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),f(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[f(i.ControlExample,{class:`commandbar-flyout-example`,SampleDefinition:`CommandBarFlyout\\CommandbarflyoutCommandsAppObject.txt`,HeaderText:`{x:Bind Labels.Header, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CommandBarFlyoutXaml}`,CSharp:`{x:Bind CommandBarFlyoutCSharp}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.StackPanel,null,{default:t(()=>[f(i.TextBlock,{Text:`{x:Bind Labels.ImageHint, Mode=OneWay}`,TextWrapping:`Wrap`}),f(i.Button,{"x:Name":`myImageButton`,Margin:`0,12`,Padding:`0`,"AutomationProperties.Name":`{x:Bind Labels.Mountain, Mode=OneWay}`,Click:`MyImageButton_Click`,ContextRequested:`MyImageButton_ContextRequested`},{default:t(()=>[f(i.Image,{"x:Name":`Image1`,Height:`300`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output,null,{default:t(()=>[f(i.TextBlock,{"x:Name":`SelectedOptionText`,Text:`{x:Bind SelectedOptionOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),f(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var j=i(E,[[`render`,A],[`__scopeId`,`data-v-6f056a2a`],[`__file`,`CommandBarFlyoutPage.vue`]]);export{j as default};