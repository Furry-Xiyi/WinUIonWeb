import{Fi as e,Gi as t,I as n,Ti as r,Ui as i,Wi as a,Wt as o,a as ee,ai as s,di as c,et as l,hi as u,o as te,or as d,ri as f,sr as p,t as ne,wi as m,xt as re}from"./ScrollViewer-PoO_ma9Z.js";import{t as h}from"./Button-DjU0urmJ.js";import{t as ie}from"./StackPanel-CT7pl8zy.js";import{c as ae,d as oe,f as se,l as ce,n as le,p as g,t as _}from"./MenuFlyoutItems-CdFb5Edx.js";import{t as ue}from"./MenuFlyout-BmClHGXs.js";import{t as de}from"./ToggleButton-DwmhXZge.js";import{a as fe,t as pe}from"./ControlExample-C1ahTZEr.js";import{t as v}from"./pageState-BN3kXI7L.js";var y=`--- header
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
`,D={__name:`MenuFlyoutPage`,setup(e,{expose:o}){o();let{t:s}=l(),c=u(`currentPage`),{isFavoriteState:m,pageTheme:D,toggleTheme:O,toggleFavorite:k}=v(c?.value||`menuflyout`),A=a({});r(d,A);let j=f(()=>({Title:s(`text.menuflyout`),Description:s(`text.a-menuflyout-displays-a-lightweight-menu-of-comm`),ToggleTheme:s(`gallery.page-header.toggle-theme`),AppBarHeader:s(`text.a-menuflyout-attached-to-an-appbarbutton`),ToggleHeader:s(`sample.menuflyout.toggle-items`),CascadingHeader:s(`sample.menuflyout.cascading`),SplitHeader:s(`sample.menuflyout.split-items`),IconsHeader:s(`sample.menuflyout.icons`),KeyboardHeader:s(`sample.menuflyout.keyboard`),RadioHeader:s(`sample.menuflyout.radio`),Sort:s(`sample.menuflyout.sort`),ByRating:s(`sample.menuflyout.by-rating`),ByMatch:s(`sample.menuflyout.by-match`),ByDistance:s(`sample.menuflyout.by-distance`),Options:s(`sample.menuflyout.options`),Reset:s(`sample.menuflyout.reset`),Repeat:s(`sample.menuflyout.repeat`),Shuffle:s(`sample.menuflyout.shuffle`),FileOptions:s(`sample.menuflyout.file-options`),Open:s(`sample.menuflyout.open`),SendTo:s(`sample.menuflyout.send-to`),Bluetooth:s(`sample.menuflyout.bluetooth`),DesktopShortcut:s(`sample.menuflyout.desktop-shortcut`),CompressedFile:s(`sample.menuflyout.compressed-file`),CompressEmail:s(`sample.menuflyout.compress-email`),Compress7z:s(`sample.menuflyout.compress-7z`),CompressZip:s(`sample.menuflyout.compress-zip`),Save:s(`sample.menuflyout.save`),SaveDocx:s(`sample.menuflyout.save-docx`),SavePdf:s(`sample.menuflyout.save-pdf`),SaveTxt:s(`sample.menuflyout.save-txt`),Share:s(`sample.menuflyout.share`),ShareEmail:s(`sample.menuflyout.share-email`),ShareLink:s(`sample.menuflyout.share-link`),EditOptions:s(`sample.menuflyout.edit-options`),Copy:s(`sample.menuflyout.copy`),Delete:s(`sample.menuflyout.delete`),Rename:s(`sample.menuflyout.rename`),Select:s(`sample.menuflyout.select`),Landscape:s(`sample.menuflyout.landscape`),Portrait:s(`sample.menuflyout.portrait`),SmallIcons:s(`sample.menuflyout.small-icons`),MediumIcons:s(`sample.menuflyout.medium-icons`),LargeIcons:s(`sample.menuflyout.large-icons`)})),M=f(()=>s(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),N=f(()=>m.value?``:``),P=i(``),F=t(null),I={rating:`sample.menuflyout.rating`,match:`sample.menuflyout.match`,distance:`sample.menuflyout.distance`},L=f(()=>P.value?s(`sample.menuflyout.sort-output`,{value:s(I[P.value])}):``),R=f(()=>F.value?s(`sample.menuflyout.clicked-output`,{value:F.value.Text}):``),z=e=>{Object.prototype.hasOwnProperty.call(I,e?.Tag)&&(P.value=e.Tag)},B=e=>{e?.Text&&(F.value=e)},V=()=>{},H=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,U=e=>{let t=E.indexOf(`    private void ${e}(`);if(t<0)return``;let n=E.indexOf(`{`,t),r=0;for(let e=n;e<E.length;e+=1)if(`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`[e]===`}`&&(--r,r===0))return E.slice(t,e+1).replace(/^ {4}/gm,``).trim();return``},W=H(y,`xaml`),G=H(b,`xaml`),K=H(x,`xaml`),q=H(S,`xaml`),J=H(C,`xaml`),Y=H(w,`xaml`),X=H(T,`xaml`),Z=U(`MenuFlyoutItem_Click`),Q=U(`SplitMenuFlyoutItem_Click`);r(p,{Labels:j,FavoriteLabel:M,FavoriteGlyph:N,isFavoriteState:m,pageTheme:D,toggleTheme:O,toggleFavorite:k,SortOutput:L,SplitOutput:R,MenuFlyoutItem_Click:z,SplitMenuFlyoutItem_Click:B,Example5_Loaded:V,AppBarXaml:W,ToggleXaml:G,CascadingXaml:K,SplitXaml:q,IconsXaml:J,KeyboardXaml:Y,RadioXaml:X,SortCSharp:Z,SplitCSharp:Q});let $={t:s,currentPage:c,isFavoriteState:m,pageTheme:D,toggleTheme:O,toggleFavorite:k,Names:A,Labels:j,FavoriteLabel:M,FavoriteGlyph:N,SelectedSort:P,SelectedSplitItem:F,sortResourceKeys:I,SortOutput:L,SplitOutput:R,MenuFlyoutItem_Click:z,SplitMenuFlyoutItem_Click:B,Example5_Loaded:V,sampleSection:H,officialHandler:U,AppBarXaml:W,ToggleXaml:G,CascadingXaml:K,SplitXaml:q,IconsXaml:J,KeyboardXaml:Y,RadioXaml:X,SortCSharp:Z,SplitCSharp:Q,computed:f,inject:u,provide:r,ref:i,shallowReactive:a,shallowRef:t,AppBarButton:re,Button:h,ControlExample:pe,get ControlExampleSubstitution(){return fe},FontIcon:ee,MenuFlyout:ue,get KeyboardAccelerator(){return _},get MenuFlyoutItem(){return le},get MenuFlyoutSeparator(){return ae},get MenuFlyoutSubItem(){return ce},get RadioMenuFlyoutItem(){return oe},get SplitMenuFlyoutItem(){return se},get ToggleMenuFlyoutItem(){return g},Page:n,ScrollViewer:ne,StackPanel:ie,TextBlock:te,ToggleButton:de,get useI18n(){return l},get xamlNameScopeKey(){return d},get xamlScopeKey(){return p},get createPageState(){return v},get appBarSample(){return y},get toggleSample(){return b},get cascadingSample(){return x},get splitSample(){return S},get iconsSample(){return C},get keyboardSample(){return w},get radioSample(){return T},get officialCodeBehind(){return E}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function O(t,n,r,i,a,o){return m(),s(i.Page,null,{default:e(()=>[c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[c(i.StackPanel,{class:`page-heading`},{default:e(()=>[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:e(()=>[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),c(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`MenuFlyout\\AppbarbuttonMenuflyout.txt`,HeaderText:`{x:Bind Labels.AppBarHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind AppBarXaml}`,CSharp:`{x:Bind SortCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.StackPanel,{"x:Name":`Control1`,class:`menu-example-row`,Orientation:`Horizontal`},{default:e(()=>[c(i.AppBarButton,{"AutomationProperties.Name":`{x:Bind Labels.Sort, Mode=OneWay}`,Icon:`Sort`,IsCompact:`True`,"ToolTipService.ToolTip":`{x:Bind Labels.Sort, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`rating`,Text:`{x:Bind Labels.ByRating, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`match`,Text:`{x:Bind Labels.ByMatch, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Click:`MenuFlyoutItem_Click`,Tag:`distance`,Text:`{x:Bind Labels.ByDistance, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.TextBlock,{"x:Name":`Control1Output`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SortOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`MenuFlyout\\MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt`,HeaderText:`{x:Bind Labels.ToggleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Button,{"x:Name":`Control2`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Reset, Mode=OneWay}`}),c(i.MenuFlyoutSeparator),c(i.ToggleMenuFlyoutItem,{"x:Name":`RepeatToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Repeat, Mode=OneWay}`}),c(i.ToggleMenuFlyoutItem,{"x:Name":`ShuffleToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Shuffle, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options),c(i.ControlExample.Substitutions,null,{default:e(()=>[c(i.ControlExampleSubstitution,{Key:`RepeatToggle`,Value:`{x:Bind RepeatToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`}),c(i.ControlExampleSubstitution,{Key:`ShuffleToggle`,Value:`{x:Bind ShuffleToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`})]),_:1})]),_:1}),c(i.ControlExample,{"x:Name":`Example3`,SampleDefinition:`MenuFlyout\\MenuflyoutCascadingMenus.txt`,HeaderText:`{x:Bind Labels.CascadingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CascadingXaml}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Button,{"x:Name":`Control3`,Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Open, Mode=OneWay}`}),c(i.MenuFlyoutSubItem,{Text:`{x:Bind Labels.SendTo, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Bluetooth, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.DesktopShortcut, Mode=OneWay}`}),c(i.MenuFlyoutSubItem,{Text:`{x:Bind Labels.CompressedFile, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.CompressEmail, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Compress7z, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.CompressZip, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{"x:Name":`Example3b`,SampleDefinition:`MenuFlyout\\MenuflyoutSplitmenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.SplitHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SplitXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.StackPanel,{"x:Name":`Control3b`,class:`menu-example-row`,Orientation:`Horizontal`},{default:e(()=>[c(i.Button,{Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.SplitMenuFlyoutItem,{"x:Name":`SaveSplitItem`,Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.Save, Mode=OneWay}`},{default:e(()=>[c(i.SplitMenuFlyoutItem.Icon,null,{default:e(()=>[c(i.FontIcon,{Glyph:``})]),_:1}),c(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveDocx, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SavePdf, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveTxt, Mode=OneWay}`})]),_:1}),c(i.SplitMenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Icon:`Share`,Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareEmail, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareLink, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.TextBlock,{"x:Name":`Control3bOutput`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SplitOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{"x:Name":`Example4`,SampleDefinition:`MenuFlyout\\MenuflyoutIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Button,{"x:Name":`Control4`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem.Icon,null,{default:e(()=>[c(i.FontIcon,{Glyph:``})]),_:1})]),_:1}),c(i.MenuFlyoutItem,{Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`}),c(i.MenuFlyoutSeparator),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{"x:Name":`Example5`,FontFamily:`Segoe UI`,SampleDefinition:`MenuFlyout\\MenuflyoutIconsKeyboardAccelerators.txt`,Loaded:`Example5_Loaded`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Button,{"x:Name":`Control5`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem.Icon,null,{default:e(()=>[c(i.FontIcon,{Glyph:``})]),_:1}),c(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[c(i.KeyboardAccelerator,{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),c(i.MenuFlyoutItem,{FontFamily:`Consolas`,Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[c(i.KeyboardAccelerator,{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),c(i.MenuFlyoutItem,{FontFamily:`Segoe UI`,Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`},{default:e(()=>[c(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[c(i.KeyboardAccelerator,{Key:`Delete`})]),_:1})]),_:1}),c(i.MenuFlyoutSeparator),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),c(i.MenuFlyoutItem,{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{"x:Name":`Example6`,SampleDefinition:`MenuFlyout\\MenuflyoutRadiomenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.RadioHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RadioXaml}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Button,{"x:Name":`Control6`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:e(()=>[c(i.Button.Flyout,null,{default:e(()=>[c(i.MenuFlyout,null,{default:e(()=>[c(i.RadioMenuFlyoutItem,{GroupName:`OrientationGroup`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`}),c(i.RadioMenuFlyoutItem,{GroupName:`OrientationGroup`,IsChecked:`True`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`}),c(i.MenuFlyoutSeparator),c(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`}),c(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,IsChecked:`True`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`}),c(i.RadioMenuFlyoutItem,{GroupName:`SizeGroup`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=o(D,[[`render`,O],[`__scopeId`,`data-v-a73fd4c1`],[`__file`,`MenuFlyoutPage.vue`]]);export{k as default};