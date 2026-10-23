import{Di as e,Ei as t,Gi as n,I as r,Ki as i,Li as a,Wt as o,Y as s,_i as c,a as l,ai as u,et as d,o as f,oi as p,pi as m,si as h,sr as g,t as _,xt as v}from"./ScrollViewer-BWDA_C78.js";import{t as y}from"./Button-BNDPNdYJ.js";import{t as b}from"./Image-i6y7QZ_e.js";import{t as x}from"./StackPanel-sg_Bd5oB.js";import{t as S}from"./ToggleButton-HP5wmrvH.js";import{t as C}from"./ControlExample-CzGyf8u0.js";import{t as w}from"./pageState-CcJibQcm.js";var T=`--- header
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
`,E={__name:`CommandBarFlyoutPage`,setup(t,{expose:a}){a();let{t:o}=d(),p=c(`currentPage`),{isFavoriteState:m,pageTheme:h,toggleTheme:E,toggleFavorite:D}=w(p?.value||`commandbarflyout`),O=i({});e(g,O);let k=u(()=>({PageTitle:o(`text.commandbarflyout`),Description:o(`text.the-commandbarflyout-lets-you-provide-users-with`),ToggleTheme:o(`gallery.page-header.toggle-theme`),Header:o(`sample.commandbarflyout.object`),Share:o(`text.share`),Save:o(`text.save`),Delete:o(`text.delete`),Resize:o(`sample.commandbarflyout.resize`),Move:o(`sample.commandbarflyout.move`),ImageHint:o(`sample.commandbarflyout.open-hint`),Mountain:o(`sample.commandbarflyout.mountain`)})),A=u(()=>o(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),j=u(()=>m.value?``:``),M=n(``),N=e=>{M.value=e?.Label||``},P=u(()=>M.value?o(`sample.you-clicked`,{name:M.value}):``),F=e=>O.CommandBarFlyout1?.ShowAt(O.Image1,{ShowMode:e?`Transient`:`Standard`,Placement:`RightEdgeAlignedTop`}),I={t:o,currentPage:p,isFavoriteState:m,pageTheme:h,toggleTheme:E,toggleFavorite:D,Names:O,Labels:k,FavoriteLabel:A,FavoriteGlyph:j,clickedLabel:M,OnElementClicked:N,SelectedOptionOutput:P,ShowMenu:F,MyImageButton_Click:()=>F(!0),MyImageButton_ContextRequested:(e,t)=>{F(!1),t&&(t.Handled=!0)},CommandBarFlyoutXaml:`--- header
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
`.split(`--- c#`)[1]?.split(/\r?\n--- /)[0].trim()??``,computed:u,inject:c,provide:e,ref:n,shallowReactive:i,AppBarButton:v,Button:y,CommandBarFlyout:s,ControlExample:C,FontIcon:l,Image:b,Page:r,ScrollViewer:_,StackPanel:x,TextBlock:f,ToggleButton:S,get useI18n(){return d},get xamlNameScopeKey(){return g},get createPageState(){return w},get commandBarFlyoutDefinition(){return T}};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(e,n,r,i,o,s){return t(),h(i.Page,null,{default:a(()=>[m(i.Page.Resources,null,{default:a(()=>[m(i.CommandBarFlyout,{"x:Name":`CommandBarFlyout1`,Placement:`Right`},{default:a(()=>[m(i.CommandBarFlyout.PrimaryCommands,null,{default:a(()=>[m(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Share`,Label:`{x:Bind Labels.Share, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Share, Mode=OneWay}`}),m(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Save`,Label:`{x:Bind Labels.Save, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Save, Mode=OneWay}`}),m(i.AppBarButton,{Click:`OnElementClicked`,Icon:`Delete`,Label:`{x:Bind Labels.Delete, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.Delete, Mode=OneWay}`})]),_:1}),m(i.CommandBarFlyout.SecondaryCommands,null,{default:a(()=>[m(i.AppBarButton,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Resize, Mode=OneWay}`}),m(i.AppBarButton,{Click:`OnElementClicked`,Label:`{x:Bind Labels.Move, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[p(`div`,D,[p(`div`,O,[m(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),m(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(`div`,k,[m(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[m(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[m(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),m(i.StackPanel,{class:`gallery-page-content`},{default:a(()=>[m(i.ControlExample,{class:`commandbar-flyout-example`,SampleDefinition:`CommandBarFlyout\\CommandbarflyoutCommandsAppObject.txt`,HeaderText:`{x:Bind Labels.Header, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CommandBarFlyoutXaml}`,CSharp:`{x:Bind CommandBarFlyoutCSharp}`},{default:a(()=>[m(i.ControlExample.Example,null,{default:a(()=>[m(i.StackPanel,null,{default:a(()=>[m(i.TextBlock,{Text:`{x:Bind Labels.ImageHint, Mode=OneWay}`,TextWrapping:`Wrap`}),m(i.Button,{"x:Name":`myImageButton`,Margin:`0,12`,Padding:`0`,"AutomationProperties.Name":`{x:Bind Labels.Mountain, Mode=OneWay}`,Click:`MyImageButton_Click`,ContextRequested:`MyImageButton_ContextRequested`},{default:a(()=>[m(i.Image,{"x:Name":`Image1`,Height:`300`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output,null,{default:a(()=>[m(i.TextBlock,{"x:Name":`SelectedOptionText`,Text:`{x:Bind SelectedOptionOutput, Mode=OneWay}`,TextWrapping:`Wrap`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),m(i.ControlExample.Options)]),_:1})]),_:1})])]),_:1})]),_:1})}var j=o(E,[[`render`,A],[`__scopeId`,`data-v-6f056a2a`],[`__file`,`CommandBarFlyoutPage.vue`]]);export{j as default};