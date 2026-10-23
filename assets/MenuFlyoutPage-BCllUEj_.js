import{Di as e,Ei as t,Gi as n,I as r,Ki as i,Li as a,Wt as o,_i as s,a as ee,ai as c,cr as l,et as u,o as te,pi as d,qi as f,si as p,sr as m,t as ne,xt as re}from"./ScrollViewer-BWDA_C78.js";import{t as ie}from"./Button-BNDPNdYJ.js";import{t as ae}from"./StackPanel-sg_Bd5oB.js";import{c as h,d as oe,f as se,l as ce,n as le,p as ue,t as de}from"./MenuFlyoutItems-RkThyUiU.js";import{t as fe}from"./MenuFlyout-CQtMsdJa.js";import{t as g}from"./ToggleButton-HP5wmrvH.js";import{a as _,t as pe}from"./ControlExample-CzGyf8u0.js";import{t as v}from"./pageState-CcJibQcm.js";var y=`--- header
An AppBarButton with a MenuFlyout.
--- xaml
<AppBarButton Icon="Sort" IsCompact="True" ToolTipService.ToolTip="Sort" AutomationProperties.Name="Sort">
    <AppBarButton.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="By rating" Click="MenuFlyoutItem_Click" Tag="rating"/>
            <MenuFlyoutItem Text="By match" Click="MenuFlyoutItem_Click" Tag="match"/>
            <MenuFlyoutItem Text="By distance" Click="MenuFlyoutItem_Click" Tag="distance"/>
        </MenuFlyout>
    </AppBarButton.Flyout>
</AppBarButton>`,b=`--- header
A MenuFlyout with ToggleMenuFlyoutItems and MenuFlyoutSeparator.
--- xaml
<Button Content="Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Reset"/>
            <MenuFlyoutSeparator/>
            <ToggleMenuFlyoutItem Text="Repeat" IsChecked="$(RepeatToggle)"/>
            <ToggleMenuFlyoutItem Text="Shuffle" IsChecked="$(ShuffleToggle)"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>`,x=`--- header
A MenuFlyout with cascading menus.
--- xaml
<Button Content="File Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Open"/>
            <MenuFlyoutSubItem Text="Send to">
                <MenuFlyoutItem Text="Bluetooth" />
                <MenuFlyoutItem Text="Desktop (shortcut)" />
                <MenuFlyoutSubItem Text="Compressed file">
                    <MenuFlyoutItem Text="Compress and email" />
                    <MenuFlyoutItem Text="Compress to .7z" />
                    <MenuFlyoutItem Text="Compress to .zip" />
                </MenuFlyoutSubItem>
            </MenuFlyoutSubItem>
        </MenuFlyout>
    </Button.Flyout>
</Button>`,S=`--- header
A MenuFlyout with SplitMenuFlyoutItems.
--- xaml
<Button Content="File Options">
    <Button.Flyout>
        <MenuFlyout>
            <SplitMenuFlyoutItem Text="Save" Click="SplitMenuFlyoutItem_Click">
                <SplitMenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE74E;"/>
                </SplitMenuFlyoutItem.Icon>
                <MenuFlyoutItem Text="Save as .docx" Click="SplitMenuFlyoutItem_Click"/>
                <MenuFlyoutItem Text="Save as .pdf" Click="SplitMenuFlyoutItem_Click"/>
                <MenuFlyoutItem Text="Save as .txt" Click="SplitMenuFlyoutItem_Click"/>
            </SplitMenuFlyoutItem>
            <SplitMenuFlyoutItem Text="Share" Icon="Share" Click="SplitMenuFlyoutItem_Click">
                <MenuFlyoutItem Text="Share via email" Click="SplitMenuFlyoutItem_Click"/>
                <MenuFlyoutItem Text="Share via link" Click="SplitMenuFlyoutItem_Click"/>
            </SplitMenuFlyoutItem>
        </MenuFlyout>
    </Button.Flyout>
</Button>`,C=`--- header
A MenuFlyout with icons.
--- xaml
<Button Content="Edit Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Share">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE72D;"/>
                </MenuFlyoutItem.Icon>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Copy" Icon="Copy"/>
            <MenuFlyoutItem Text="Delete" Icon="Delete"/>
            <MenuFlyoutSeparator/>
            <MenuFlyoutItem Text="Rename"/>
            <MenuFlyoutItem Text="Select"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>`,w=`--- header
A MenuFlyout with icons and Keyboard Accelerators.
--- xaml
<Button Content="Edit Options">
    <Button.Flyout>
        <MenuFlyout>
            <MenuFlyoutItem Text="Share">
                <MenuFlyoutItem.Icon>
                    <FontIcon Glyph="&#xE72D;"/>
                </MenuFlyoutItem.Icon>
                <MenuFlyoutItem.KeyboardAccelerators>
                    <KeyboardAccelerator Key="S" Modifiers="Control"/>
                </MenuFlyoutItem.KeyboardAccelerators>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Copy" Icon="Copy">
                <MenuFlyoutItem.KeyboardAccelerators>
                    <KeyboardAccelerator Key="C" Modifiers="Control"/>
                </MenuFlyoutItem.KeyboardAccelerators>
            </MenuFlyoutItem>
            <MenuFlyoutItem Text="Delete" Icon="Delete">
                <MenuFlyoutItem.KeyboardAccelerators>
                    <KeyboardAccelerator Key="Delete" />
                </MenuFlyoutItem.KeyboardAccelerators>
            </MenuFlyoutItem>
            <MenuFlyoutSeparator/>
            <MenuFlyoutItem Text="Rename"/>
            <MenuFlyoutItem Text="Select"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>`,T=`--- header
A MenuFlyout with RadioMenuFlyoutItems
--- xaml
<Button Content="Options">
    <Button.Flyout>
        <MenuFlyout>
            <RadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup"/>
            <RadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True"/>
            <MenuFlyoutSeparator/>
            <RadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup"/>
            <RadioMenuFlyoutItem Text="Medium icons" IsChecked="True" GroupName="SizeGroup"/>
            <RadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup"/>
        </MenuFlyout>
    </Button.Flyout>
</Button>`,E=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class MenuFlyoutPage : Page
{
    public MenuFlyoutPage()
    {
        this.InitializeComponent();
    }

    private void MenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            string? sortOption = selectedItem.Tag.ToString();
            switch (sortOption)
            {
                case "rating":
                    //SortByRating();
                    break;
                case "match":
                    //SortByMatch();
                    break;
                case "distance":
                    //SortByDistance();
                    break;
            }
            Control1Output.Text = "Sort by: " + sortOption;
        }
    }

    private void Example5_Loaded(object sender, RoutedEventArgs e)
    {

    }

    private void SplitMenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            Control3bOutput.Text = "Clicked: " + selectedItem.Text;
        }
    }
}
`,D={__name:`MenuFlyoutPage`,setup(t,{expose:a}){a();let{t:o}=u(),d=s(`currentPage`),{isFavoriteState:p,pageTheme:D,toggleTheme:O,toggleFavorite:k}=v(d?.value||`menuflyout`),A=i({});e(m,A);let j=c(()=>({Title:o(`text.menuflyout`),Description:o(`text.a-menuflyout-displays-a-lightweight-menu-of-comm`),ToggleTheme:o(`gallery.page-header.toggle-theme`),AppBarHeader:o(`text.a-menuflyout-attached-to-an-appbarbutton`),ToggleHeader:o(`sample.menuflyout.toggle-items`),CascadingHeader:o(`sample.menuflyout.cascading`),SplitHeader:o(`sample.menuflyout.split-items`),IconsHeader:o(`sample.menuflyout.icons`),KeyboardHeader:o(`sample.menuflyout.keyboard`),RadioHeader:o(`sample.menuflyout.radio`),Sort:o(`sample.menuflyout.sort`),ByRating:o(`sample.menuflyout.by-rating`),ByMatch:o(`sample.menuflyout.by-match`),ByDistance:o(`sample.menuflyout.by-distance`),Options:o(`sample.menuflyout.options`),Reset:o(`sample.menuflyout.reset`),Repeat:o(`sample.menuflyout.repeat`),Shuffle:o(`sample.menuflyout.shuffle`),FileOptions:o(`sample.menuflyout.file-options`),Open:o(`sample.menuflyout.open`),SendTo:o(`sample.menuflyout.send-to`),Bluetooth:o(`sample.menuflyout.bluetooth`),DesktopShortcut:o(`sample.menuflyout.desktop-shortcut`),CompressedFile:o(`sample.menuflyout.compressed-file`),CompressEmail:o(`sample.menuflyout.compress-email`),Compress7z:o(`sample.menuflyout.compress-7z`),CompressZip:o(`sample.menuflyout.compress-zip`),Save:o(`sample.menuflyout.save`),SaveDocx:o(`sample.menuflyout.save-docx`),SavePdf:o(`sample.menuflyout.save-pdf`),SaveTxt:o(`sample.menuflyout.save-txt`),Share:o(`sample.menuflyout.share`),ShareEmail:o(`sample.menuflyout.share-email`),ShareLink:o(`sample.menuflyout.share-link`),EditOptions:o(`sample.menuflyout.edit-options`),Copy:o(`sample.menuflyout.copy`),Delete:o(`sample.menuflyout.delete`),Rename:o(`sample.menuflyout.rename`),Select:o(`sample.menuflyout.select`),Landscape:o(`sample.menuflyout.landscape`),Portrait:o(`sample.menuflyout.portrait`),SmallIcons:o(`sample.menuflyout.small-icons`),MediumIcons:o(`sample.menuflyout.medium-icons`),LargeIcons:o(`sample.menuflyout.large-icons`)})),M=c(()=>o(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=c(()=>p.value?``:``),P=n(``),F=f(null),I={rating:`sample.menuflyout.rating`,match:`sample.menuflyout.match`,distance:`sample.menuflyout.distance`},L=c(()=>P.value?o(`sample.menuflyout.sort-output`,{value:o(I[P.value])}):``),R=c(()=>F.value?o(`sample.menuflyout.clicked-output`,{value:F.value.Text}):``),z=e=>{Object.prototype.hasOwnProperty.call(I,e?.Tag)&&(P.value=e.Tag)},B=e=>{e?.Text&&(F.value=e)},V=()=>{},H=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,U=e=>{let t=E.indexOf(`    private void ${e}(`);if(t<0)return``;let n=E.indexOf(`{`,t),r=0;for(let e=n;e<E.length;e+=1)if(`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class MenuFlyoutPage : Page
{
    public MenuFlyoutPage()
    {
        this.InitializeComponent();
    }

    private void MenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            string? sortOption = selectedItem.Tag.ToString();
            switch (sortOption)
            {
                case "rating":
                    //SortByRating();
                    break;
                case "match":
                    //SortByMatch();
                    break;
                case "distance":
                    //SortByDistance();
                    break;
            }
            Control1Output.Text = "Sort by: " + sortOption;
        }
    }

    private void Example5_Loaded(object sender, RoutedEventArgs e)
    {

    }

    private void SplitMenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            Control3bOutput.Text = "Clicked: " + selectedItem.Text;
        }
    }
}
`[e]===`{`)r+=1;else if(`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace WinUIGallery.ControlPages;

public sealed partial class MenuFlyoutPage : Page
{
    public MenuFlyoutPage()
    {
        this.InitializeComponent();
    }

    private void MenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            string? sortOption = selectedItem.Tag.ToString();
            switch (sortOption)
            {
                case "rating":
                    //SortByRating();
                    break;
                case "match":
                    //SortByMatch();
                    break;
                case "distance":
                    //SortByDistance();
                    break;
            }
            Control1Output.Text = "Sort by: " + sortOption;
        }
    }

    private void Example5_Loaded(object sender, RoutedEventArgs e)
    {

    }

    private void SplitMenuFlyoutItem_Click(object sender, RoutedEventArgs e)
    {
        if (sender is MenuFlyoutItem selectedItem)
        {
            Control3bOutput.Text = "Clicked: " + selectedItem.Text;
        }
    }
}
`[e]===`}`&&(--r,r===0))return E.slice(t,e+1).replace(/^ {4}/gm,``).trim();return``},W=H(y,`xaml`),G=H(b,`xaml`),K=H(x,`xaml`),q=H(S,`xaml`),J=H(C,`xaml`),Y=H(w,`xaml`),X=H(T,`xaml`),Z=U(`MenuFlyoutItem_Click`),Q=U(`SplitMenuFlyoutItem_Click`);e(l,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:p,pageTheme:D,toggleTheme:O,toggleFavorite:k,SortOutput:L,SplitOutput:R,MenuFlyoutItem_Click:z,SplitMenuFlyoutItem_Click:B,Example5_Loaded:V,AppBarXaml:W,ToggleXaml:G,CascadingXaml:K,SplitXaml:q,IconsXaml:J,KeyboardXaml:Y,RadioXaml:X,SortCSharp:Z,SplitCSharp:Q});let $={t:o,currentPage:d,isFavoriteState:p,pageTheme:D,toggleTheme:O,toggleFavorite:k,Names:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,SelectedSort:P,SelectedSplitItem:F,sortResourceKeys:I,SortOutput:L,SplitOutput:R,MenuFlyoutItem_Click:z,SplitMenuFlyoutItem_Click:B,Example5_Loaded:V,sampleSection:H,officialHandler:U,AppBarXaml:W,ToggleXaml:G,CascadingXaml:K,SplitXaml:q,IconsXaml:J,KeyboardXaml:Y,RadioXaml:X,SortCSharp:Z,SplitCSharp:Q,computed:c,inject:s,provide:e,ref:n,shallowReactive:i,shallowRef:f,AppBarButton:re,Button:ie,ControlExample:pe,get ControlExampleSubstitution(){return _},FontIcon:ee,MenuFlyout:fe,get KeyboardAccelerator(){return de},get MenuFlyoutItem(){return le},get MenuFlyoutSeparator(){return h},get MenuFlyoutSubItem(){return ce},get RadioMenuFlyoutItem(){return oe},get SplitMenuFlyoutItem(){return se},get ToggleMenuFlyoutItem(){return ue},Page:r,ScrollViewer:ne,StackPanel:ae,TextBlock:te,ToggleButton:g,get useI18n(){return u},get xamlNameScopeKey(){return m},get xamlScopeKey(){return l},get createPageState(){return v},get appBarSample(){return y},get toggleSample(){return b},get cascadingSample(){return x},get splitSample(){return S},get iconsSample(){return C},get keyboardSample(){return w},get radioSample(){return T},get officialCodeBehind(){return E}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function O(e,n,r,i,o,s){return t(),p(i.Page,null,{default:a(()=>[d(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[d(i.StackPanel,{class:`gallery-item-page`},{default:a(()=>[d(i.StackPanel,{class:`page-heading`},{default:a(()=>[d(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),d(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:a(()=>[d(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[d(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[d(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),d(i.StackPanel,{class:`gallery-page-content`},{default:a(()=>[d(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`MenuFlyout\\AppbarbuttonMenuflyout.txt`,HeaderText:`{x:Bind Labels.AppBarHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind AppBarXaml}`,CSharp:`{x:Bind SortCSharp}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.StackPanel,{"x:Name":`Control1`,class:`menu-example-row`,Orientation:`Horizontal`},{default:a(()=>[d(i.AppBarButton,{"AutomationProperties.Name":`{x:Bind Labels.Sort, Mode=OneWay}`,Icon:`Sort`,IsCompact:`True`,"ToolTipService.ToolTip":`{x:Bind Labels.Sort, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`rating`,Text:`{x:Bind Labels.ByRating, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`match`,Text:`{x:Bind Labels.ByMatch, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`distance`,Text:`{x:Bind Labels.ByDistance, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),d(i.TextBlock,{"x:Name":`Control1Output`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SortOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`MenuFlyout\\MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt`,HeaderText:`{x:Bind Labels.ToggleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.Button,{"x:Name":`Control2`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reset, Mode=OneWay}`}),d(i.MenuFlyoutSeparator),d(i.ToggleMenuFlyoutItem,{"x:Name":`RepeatToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Repeat, Mode=OneWay}`}),d(i.ToggleMenuFlyoutItem,{"x:Name":`ShuffleToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Shuffle, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options),d(i.ControlExample.Substitutions,null,{default:a(()=>[d(i.ControlExampleSubstitution,{Key:`RepeatToggle`,Value:`{x:Bind RepeatToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`}),d(i.ControlExampleSubstitution,{Key:`ShuffleToggle`,Value:`{x:Bind ShuffleToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`})]),_:1})]),_:1}),d(i.ControlExample,{"x:Name":`Example3`,SampleDefinition:`MenuFlyout\\MenuflyoutCascadingMenus.txt`,HeaderText:`{x:Bind Labels.CascadingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CascadingXaml}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.Button,{"x:Name":`Control3`,Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Open, Mode=OneWay}`}),d(i.MenuFlyoutSubItem,{Text:`{x:Bind Labels.SendTo, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Bluetooth, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.DesktopShortcut, Mode=OneWay}`}),d(i.MenuFlyoutSubItem,{Text:`{x:Bind Labels.CompressedFile, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.CompressEmail, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Compress7z, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.CompressZip, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{"x:Name":`Example3b`,SampleDefinition:`MenuFlyout\\MenuflyoutSplitmenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.SplitHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SplitXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.StackPanel,{"x:Name":`Control3b`,class:`menu-example-row`,Orientation:`Horizontal`},{default:a(()=>[d(i.Button,{Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.SplitMenuFlyoutItem,{"x:Name":`SaveSplitItem`,Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.Save, Mode=OneWay}`},{default:a(()=>[d(i.SplitMenuFlyoutItem.Icon,null,{default:a(()=>[d(i.FontIcon,{Glyph:``})]),_:1}),d(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveDocx, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SavePdf, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveTxt, Mode=OneWay}`})]),_:1}),d(i.SplitMenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Icon:`Share`,Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareEmail, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareLink, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.TextBlock,{"x:Name":`Control3bOutput`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SplitOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{"x:Name":`Example4`,SampleDefinition:`MenuFlyout\\MenuflyoutIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.Button,{"x:Name":`Control4`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem.Icon,null,{default:a(()=>[d(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),d(i.MenuFlyoutItem,{Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`}),d(i.MenuFlyoutSeparator),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{"x:Name":`Example5`,FontFamily:`Segoe UI`,SampleDefinition:`MenuFlyout\\MenuflyoutIconsKeyboardAccelerators.txt`,Loaded:`Example5_Loaded`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.Button,{"x:Name":`Control5`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem.Icon,null,{default:a(()=>[d(i.FontIcon,{Glyph:``})]),_:1}),d(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:a(()=>[d(i.KeyboardAccelerator,{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),d(i.MenuFlyoutItem,{FontFamily:`Consolas`,Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:a(()=>[d(i.KeyboardAccelerator,{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),d(i.MenuFlyoutItem,{FontFamily:`Segoe UI`,Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`},{default:a(()=>[d(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:a(()=>[d(i.KeyboardAccelerator,{Key:`Delete`})]),_:1})]),_:1}),d(i.MenuFlyoutSeparator),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),d(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1}),d(i.ControlExample,{"x:Name":`Example6`,SampleDefinition:`MenuFlyout\\MenuflyoutRadiomenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.RadioHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RadioXaml}`},{default:a(()=>[d(i.ControlExample.Example,null,{default:a(()=>[d(i.Button,{"x:Name":`Control6`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:a(()=>[d(i.Button.Flyout,null,{default:a(()=>[d(i.MenuFlyout,null,{default:a(()=>[d(i.RadioMenuFlyoutItem,{GroupName:`OrientationGroup`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`}),d(i.RadioMenuFlyoutItem,{GroupName:`OrientationGroup`,IsChecked:`True`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`}),d(i.MenuFlyoutSeparator),d(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`}),d(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,IsChecked:`True`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`}),d(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=o(D,[[`render`,O],[`__scopeId`,`data-v-a73fd4c1`],[`__file`,`MenuFlyoutPage.vue`]]);export{k as default};