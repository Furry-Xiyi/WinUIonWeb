import{Ai as e,Bi as t,Cn as n,Ji as r,Mn as i,P as ee,Xi as a,Yi as o,a as te,bi as s,bn as c,ci as l,dr as u,fr as d,gi as f,ki as p,o as ne,p as m,t as re,ui as h}from"./ScrollViewer-CHNE18MA.js";import{t as ie}from"./Button-DO0TiUOq.js";import{t as ae}from"./StackPanel-C60XOD66.js";import{c as oe,d as se,f as ce,l as g,n as _,p as le,t as ue}from"./MenuFlyoutItems-Z4nCtluL.js";import{t as de}from"./ToggleButton-ZsjZg8Nu.js";import{t as fe}from"./ControlExample-BKyw2NwY.js";import{t as pe}from"./MenuFlyout-BEZZYoyH.js";import{t as v}from"./pageState-Djrh7EdY.js";var y=`--- header
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
`,D={__name:`MenuFlyoutPage`,setup(t,{expose:i}){i();let{t:f}=m(),p=s(`currentPage`),{isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k}=v(p?.value||`menuflyout`),A=o({});e(u,A);let j=l(()=>({Title:f(`text.menuflyout`),Description:f(`text.a-menuflyout-displays-a-lightweight-menu-of-comm`),ToggleTheme:f(`gallery.page-header.toggle-theme`),AppBarHeader:f(`text.a-menuflyout-attached-to-an-appbarbutton`),ToggleHeader:f(`sample.menuflyout.toggle-items`),CascadingHeader:f(`sample.menuflyout.cascading`),SplitHeader:f(`sample.menuflyout.split-items`),IconsHeader:f(`sample.menuflyout.icons`),KeyboardHeader:f(`sample.menuflyout.keyboard`),RadioHeader:f(`sample.menuflyout.radio`),Sort:f(`sample.menuflyout.sort`),ByRating:f(`sample.menuflyout.by-rating`),ByMatch:f(`sample.menuflyout.by-match`),ByDistance:f(`sample.menuflyout.by-distance`),Options:f(`sample.menuflyout.options`),Reset:f(`sample.menuflyout.reset`),Repeat:f(`sample.menuflyout.repeat`),Shuffle:f(`sample.menuflyout.shuffle`),FileOptions:f(`sample.menuflyout.file-options`),Open:f(`sample.menuflyout.open`),SendTo:f(`sample.menuflyout.send-to`),Bluetooth:f(`sample.menuflyout.bluetooth`),DesktopShortcut:f(`sample.menuflyout.desktop-shortcut`),CompressedFile:f(`sample.menuflyout.compressed-file`),CompressEmail:f(`sample.menuflyout.compress-email`),Compress7z:f(`sample.menuflyout.compress-7z`),CompressZip:f(`sample.menuflyout.compress-zip`),Save:f(`sample.menuflyout.save`),SaveDocx:f(`sample.menuflyout.save-docx`),SavePdf:f(`sample.menuflyout.save-pdf`),SaveTxt:f(`sample.menuflyout.save-txt`),Share:f(`sample.menuflyout.share`),ShareEmail:f(`sample.menuflyout.share-email`),ShareLink:f(`sample.menuflyout.share-link`),EditOptions:f(`sample.menuflyout.edit-options`),Copy:f(`sample.menuflyout.copy`),Delete:f(`sample.menuflyout.delete`),Rename:f(`sample.menuflyout.rename`),Select:f(`sample.menuflyout.select`),Landscape:f(`sample.menuflyout.landscape`),Portrait:f(`sample.menuflyout.portrait`),SmallIcons:f(`sample.menuflyout.small-icons`),MediumIcons:f(`sample.menuflyout.medium-icons`),LargeIcons:f(`sample.menuflyout.large-icons`)})),M=l(()=>f(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=l(()=>h.value?``:``),P=r(``),F=a(null),I={rating:`sample.menuflyout.rating`,match:`sample.menuflyout.match`,distance:`sample.menuflyout.distance`},L=l(()=>P.value?f(`sample.menuflyout.sort-output`,{value:f(I[P.value])}):``),R=l(()=>F.value?f(`sample.menuflyout.clicked-output`,{value:F.value.Text}):``),z=e=>{Object.prototype.hasOwnProperty.call(I,e?.Tag)&&(P.value=e.Tag)},B=e=>{e?.Text&&(F.value=e)},V=()=>{},H=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,U=e=>{let t=E.indexOf(`    private void ${e}(`);if(t<0)return``;let n=E.indexOf(`{`,t),r=0;for(let e=n;e<E.length;e+=1)if(`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`[e]===`}`&&(--r,r===0))return E.slice(t,e+1).replace(/^ {4}/gm,``).trim();return``},W=H(y,`xaml`),G=H(b,`xaml`),K=H(x,`xaml`),q=H(S,`xaml`),J=H(C,`xaml`),Y=H(w,`xaml`),X=H(T,`xaml`),Z=U(`MenuFlyoutItem_Click`),Q=U(`SplitMenuFlyoutItem_Click`);e(d,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k,SortOutput:L,SplitOutput:R,MenuFlyoutItem_Click:z,SplitMenuFlyoutItem_Click:B,Example5_Loaded:V,AppBarXaml:W,ToggleXaml:G,CascadingXaml:K,SplitXaml:q,IconsXaml:J,KeyboardXaml:Y,RadioXaml:X,SortCSharp:Z,SplitCSharp:Q});let $={t:f,currentPage:p,isFavoriteState:h,pageTheme:D,toggleTheme:O,toggleFavorite:k,Names:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,SelectedSort:P,SelectedSplitItem:F,sortResourceKeys:I,SortOutput:L,SplitOutput:R,MenuFlyoutItem_Click:z,SplitMenuFlyoutItem_Click:B,Example5_Loaded:V,sampleSection:H,officialHandler:U,AppBarXaml:W,ToggleXaml:G,CascadingXaml:K,SplitXaml:q,IconsXaml:J,KeyboardXaml:Y,RadioXaml:X,SortCSharp:Z,SplitCSharp:Q,computed:l,inject:s,provide:e,ref:r,shallowReactive:o,shallowRef:a,AppBarButton:ee,Button:ie,ControlExample:fe,get ControlExampleSubstitution(){return c},FontIcon:te,MenuFlyout:pe,get KeyboardAccelerator(){return ue},get MenuFlyoutItem(){return _},get MenuFlyoutSeparator(){return oe},get MenuFlyoutSubItem(){return g},get RadioMenuFlyoutItem(){return se},get SplitMenuFlyoutItem(){return ce},get ToggleMenuFlyoutItem(){return le},Page:n,ScrollViewer:re,StackPanel:ae,TextBlock:ne,ToggleButton:de,get useI18n(){return m},get xamlNameScopeKey(){return u},get xamlScopeKey(){return d},get createPageState(){return v},get appBarSample(){return y},get toggleSample(){return b},get cascadingSample(){return x},get splitSample(){return S},get iconsSample(){return C},get keyboardSample(){return w},get radioSample(){return T},get officialCodeBehind(){return E}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function O(e,n,r,i,ee,a){return p(),h(i.Page,null,{default:t(()=>[f(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[f(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[f(i.StackPanel,{class:`page-heading`},{default:t(()=>[f(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),f(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:t(()=>[f(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),f(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),f(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[f(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`MenuFlyout\\AppbarbuttonMenuflyout.txt`,HeaderText:`{x:Bind Labels.AppBarHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind AppBarXaml}`,CSharp:`{x:Bind SortCSharp}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.StackPanel,{"x:Name":`Control1`,class:`menu-example-row`,Orientation:`Horizontal`},{default:t(()=>[f(i.AppBarButton,{"AutomationProperties.Name":`{x:Bind Labels.Sort, Mode=OneWay}`,Icon:`Sort`,IsCompact:`True`,"ToolTipService.ToolTip":`{x:Bind Labels.Sort, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`rating`,Text:`{x:Bind Labels.ByRating, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`match`,Text:`{x:Bind Labels.ByMatch, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`distance`,Text:`{x:Bind Labels.ByDistance, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),f(i.TextBlock,{"x:Name":`Control1Output`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SortOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1}),f(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`MenuFlyout\\MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt`,HeaderText:`{x:Bind Labels.ToggleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.Button,{"x:Name":`Control2`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reset, Mode=OneWay}`}),f(i.MenuFlyoutSeparator),f(i.ToggleMenuFlyoutItem,{"x:Name":`RepeatToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Repeat, Mode=OneWay}`}),f(i.ToggleMenuFlyoutItem,{"x:Name":`ShuffleToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Shuffle, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options),f(i.ControlExample.Substitutions,null,{default:t(()=>[f(i.ControlExampleSubstitution,{Key:`RepeatToggle`,Value:`{x:Bind RepeatToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`}),f(i.ControlExampleSubstitution,{Key:`ShuffleToggle`,Value:`{x:Bind ShuffleToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`})]),_:1})]),_:1}),f(i.ControlExample,{"x:Name":`Example3`,SampleDefinition:`MenuFlyout\\MenuflyoutCascadingMenus.txt`,HeaderText:`{x:Bind Labels.CascadingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CascadingXaml}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.Button,{"x:Name":`Control3`,Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Open, Mode=OneWay}`}),f(i.MenuFlyoutSubItem,{Text:`{x:Bind Labels.SendTo, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Bluetooth, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.DesktopShortcut, Mode=OneWay}`}),f(i.MenuFlyoutSubItem,{Text:`{x:Bind Labels.CompressedFile, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.CompressEmail, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Compress7z, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.CompressZip, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1}),f(i.ControlExample,{"x:Name":`Example3b`,SampleDefinition:`MenuFlyout\\MenuflyoutSplitmenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.SplitHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SplitXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.StackPanel,{"x:Name":`Control3b`,class:`menu-example-row`,Orientation:`Horizontal`},{default:t(()=>[f(i.Button,{Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.SplitMenuFlyoutItem,{"x:Name":`SaveSplitItem`,Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.Save, Mode=OneWay}`},{default:t(()=>[f(i.SplitMenuFlyoutItem.Icon,null,{default:t(()=>[f(i.FontIcon,{Glyph:``})]),_:1}),f(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveDocx, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SavePdf, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveTxt, Mode=OneWay}`})]),_:1}),f(i.SplitMenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Icon:`Share`,Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareEmail, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareLink, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.TextBlock,{"x:Name":`Control3bOutput`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SplitOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1}),f(i.ControlExample,{"x:Name":`Example4`,SampleDefinition:`MenuFlyout\\MenuflyoutIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.Button,{"x:Name":`Control4`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem.Icon,null,{default:t(()=>[f(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),f(i.MenuFlyoutItem,{Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`}),f(i.MenuFlyoutSeparator),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1}),f(i.ControlExample,{"x:Name":`Example5`,FontFamily:`Segoe UI`,SampleDefinition:`MenuFlyout\\MenuflyoutIconsKeyboardAccelerators.txt`,Loaded:`Example5_Loaded`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.Button,{"x:Name":`Control5`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem.Icon,null,{default:t(()=>[f(i.FontIcon,{Glyph:``})]),_:1}),f(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:t(()=>[f(i.KeyboardAccelerator,{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),f(i.MenuFlyoutItem,{FontFamily:`Consolas`,Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:t(()=>[f(i.KeyboardAccelerator,{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),f(i.MenuFlyoutItem,{FontFamily:`Segoe UI`,Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`},{default:t(()=>[f(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:t(()=>[f(i.KeyboardAccelerator,{Key:`Delete`})]),_:1})]),_:1}),f(i.MenuFlyoutSeparator),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),f(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1}),f(i.ControlExample,{"x:Name":`Example6`,SampleDefinition:`MenuFlyout\\MenuflyoutRadiomenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.RadioHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RadioXaml}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.Button,{"x:Name":`Control6`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:t(()=>[f(i.Button.Flyout,null,{default:t(()=>[f(i.MenuFlyout,null,{default:t(()=>[f(i.RadioMenuFlyoutItem,{GroupName:`OrientationGroup`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`}),f(i.RadioMenuFlyoutItem,{GroupName:`OrientationGroup`,IsChecked:`True`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`}),f(i.MenuFlyoutSeparator),f(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`}),f(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,IsChecked:`True`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`}),f(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=i(D,[[`render`,O],[`__scopeId`,`data-v-a73fd4c1`],[`__file`,`MenuFlyoutPage.vue`]]);export{k as default};