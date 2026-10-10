import{$i as e,Ai as t,Bi as n,Cn as r,Ji as i,Mn as a,P as o,Xi as s,Yi as c,a as l,bi as ee,bn as u,ci as d,dr as f,fr as te,gi as p,ki as m,o as h,p as g,t as _,ui as v}from"./ScrollViewer-DXAtwYnH.js";import{t as y}from"./Button-1Ztf3pH0.js";import{t as b}from"./StackPanel-DGz4UnE4.js";import{c as x,d as S,f as C,l as w,n as T,p as E,t as D}from"./MenuFlyoutItems-CR9hagyh.js";import{t as O}from"./ToggleButton-D0RGNdIP.js";import{t as k}from"./ControlExample-BX-yRpiQ.js";import{t as A}from"./MenuFlyout-DeJfSyub.js";import{t as j}from"./pageState-cPponcIo.js";var M=`--- header
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
</AppBarButton>`,N=`--- header
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
</Button>`,P=`--- header
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
</Button>`,F=`--- header
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
</Button>`,I=`--- header
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
</Button>`,L=`--- header
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
</Button>`,R=`--- header
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
</Button>`,z=`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`,B=a({__name:`MenuFlyoutPage`,setup(a){let{t:B}=g(),{isFavoriteState:V,pageTheme:H,toggleTheme:U,toggleFavorite:W}=j(ee(`currentPage`)?.value||`menuflyout`);t(f,c({}));let G=d(()=>({Title:B(`text.menuflyout`),Description:B(`text.a-menuflyout-displays-a-lightweight-menu-of-comm`),ToggleTheme:B(`gallery.page-header.toggle-theme`),AppBarHeader:B(`text.a-menuflyout-attached-to-an-appbarbutton`),ToggleHeader:B(`sample.menuflyout.toggle-items`),CascadingHeader:B(`sample.menuflyout.cascading`),SplitHeader:B(`sample.menuflyout.split-items`),IconsHeader:B(`sample.menuflyout.icons`),KeyboardHeader:B(`sample.menuflyout.keyboard`),RadioHeader:B(`sample.menuflyout.radio`),Sort:B(`sample.menuflyout.sort`),ByRating:B(`sample.menuflyout.by-rating`),ByMatch:B(`sample.menuflyout.by-match`),ByDistance:B(`sample.menuflyout.by-distance`),Options:B(`sample.menuflyout.options`),Reset:B(`sample.menuflyout.reset`),Repeat:B(`sample.menuflyout.repeat`),Shuffle:B(`sample.menuflyout.shuffle`),FileOptions:B(`sample.menuflyout.file-options`),Open:B(`sample.menuflyout.open`),SendTo:B(`sample.menuflyout.send-to`),Bluetooth:B(`sample.menuflyout.bluetooth`),DesktopShortcut:B(`sample.menuflyout.desktop-shortcut`),CompressedFile:B(`sample.menuflyout.compressed-file`),CompressEmail:B(`sample.menuflyout.compress-email`),Compress7z:B(`sample.menuflyout.compress-7z`),CompressZip:B(`sample.menuflyout.compress-zip`),Save:B(`sample.menuflyout.save`),SaveDocx:B(`sample.menuflyout.save-docx`),SavePdf:B(`sample.menuflyout.save-pdf`),SaveTxt:B(`sample.menuflyout.save-txt`),Share:B(`sample.menuflyout.share`),ShareEmail:B(`sample.menuflyout.share-email`),ShareLink:B(`sample.menuflyout.share-link`),EditOptions:B(`sample.menuflyout.edit-options`),Copy:B(`sample.menuflyout.copy`),Delete:B(`sample.menuflyout.delete`),Rename:B(`sample.menuflyout.rename`),Select:B(`sample.menuflyout.select`),Landscape:B(`sample.menuflyout.landscape`),Portrait:B(`sample.menuflyout.portrait`),SmallIcons:B(`sample.menuflyout.small-icons`),MediumIcons:B(`sample.menuflyout.medium-icons`),LargeIcons:B(`sample.menuflyout.large-icons`)})),K=d(()=>B(V.value?`gallery.remove-favorite`:`gallery.add-favorite`)),q=d(()=>V.value?``:``),J=i(``),Y=s(null),X={rating:`sample.menuflyout.rating`,match:`sample.menuflyout.match`,distance:`sample.menuflyout.distance`},Z=d(()=>J.value?B(`sample.menuflyout.sort-output`,{value:B(X[J.value])}):``),ne=d(()=>Y.value?B(`sample.menuflyout.clicked-output`,{value:Y.value.Text}):``),re=e=>{Object.prototype.hasOwnProperty.call(X,e?.Tag)&&(J.value=e.Tag)},ie=e=>{e?.Text&&(Y.value=e)},ae=()=>{},Q=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,$=e=>{let t=z.indexOf(`    private void ${e}(`);if(t<0)return``;let n=z.indexOf(`{`,t),r=0;for(let e=n;e<z.length;e+=1)if(`// Copyright (c) Microsoft Corporation. All rights reserved.
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
`[e]===`}`&&(--r,r===0))return z.slice(t,e+1).replace(/^ {4}/gm,``).trim();return``};return t(te,{Labels:G,FavoriteLabel:K,FavoriteGlyph:q,isFavoriteState:V,pageTheme:H,toggleTheme:U,toggleFavorite:W,SortOutput:Z,SplitOutput:ne,MenuFlyoutItem_Click:re,SplitMenuFlyoutItem_Click:ie,Example5_Loaded:ae,AppBarXaml:Q(M,`xaml`),ToggleXaml:Q(N,`xaml`),CascadingXaml:Q(P,`xaml`),SplitXaml:Q(F,`xaml`),IconsXaml:Q(I,`xaml`),KeyboardXaml:Q(L,`xaml`),RadioXaml:Q(R,`xaml`),SortCSharp:$(`MenuFlyoutItem_Click`),SplitCSharp:$(`SplitMenuFlyoutItem_Click`)}),(t,i)=>(m(),v(r,null,{default:n(()=>[p(_,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[p(b,{class:`gallery-item-page`},{default:n(()=>[p(b,{class:`page-heading`},{default:n(()=>[p(h,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),p(h,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(b,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[p(y,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[p(l,{Glyph:``,FontSize:`16`})]),_:1}),p(O,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[p(l,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),p(b,{class:`gallery-page-content`},{default:n(()=>[p(k,{"x:Name":`Example1`,SampleDefinition:`MenuFlyout\\AppbarbuttonMenuflyout.txt`,HeaderText:`{x:Bind Labels.AppBarHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind AppBarXaml}`,CSharp:`{x:Bind SortCSharp}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(b,{"x:Name":`Control1`,class:`menu-example-row`,Orientation:`Horizontal`},{default:n(()=>[p(o,{"AutomationProperties.Name":`{x:Bind Labels.Sort, Mode=OneWay}`,Icon:`Sort`,IsCompact:`True`,"ToolTipService.ToolTip":`{x:Bind Labels.Sort, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(T),{Click:`MenuFlyoutItem_Click`,Tag:`rating`,Text:`{x:Bind Labels.ByRating, Mode=OneWay}`}),p(e(T),{Click:`MenuFlyoutItem_Click`,Tag:`match`,Text:`{x:Bind Labels.ByMatch, Mode=OneWay}`}),p(e(T),{Click:`MenuFlyoutItem_Click`,Tag:`distance`,Text:`{x:Bind Labels.ByDistance, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(h,{"x:Name":`Control1Output`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SortOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),p(k.Output),p(k.Options)]),_:1}),p(k,{"x:Name":`Example2`,SampleDefinition:`MenuFlyout\\MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt`,HeaderText:`{x:Bind Labels.ToggleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ToggleXaml}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(y,{"x:Name":`Control2`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(T),{Text:`{x:Bind Labels.Reset, Mode=OneWay}`}),p(e(x)),p(e(E),{"x:Name":`RepeatToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Repeat, Mode=OneWay}`}),p(e(E),{"x:Name":`ShuffleToggleMenuFlyoutItem`,IsChecked:`True`,Text:`{x:Bind Labels.Shuffle, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(k.Output),p(k.Options),p(k.Substitutions,null,{default:n(()=>[p(e(u),{Key:`RepeatToggle`,Value:`{x:Bind RepeatToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`}),p(e(u),{Key:`ShuffleToggle`,Value:`{x:Bind ShuffleToggleMenuFlyoutItem.IsChecked, Mode=OneWay}`})]),_:1})]),_:1}),p(k,{"x:Name":`Example3`,SampleDefinition:`MenuFlyout\\MenuflyoutCascadingMenus.txt`,HeaderText:`{x:Bind Labels.CascadingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CascadingXaml}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(y,{"x:Name":`Control3`,Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(T),{Text:`{x:Bind Labels.Open, Mode=OneWay}`}),p(e(w),{Text:`{x:Bind Labels.SendTo, Mode=OneWay}`},{default:n(()=>[p(e(T),{Text:`{x:Bind Labels.Bluetooth, Mode=OneWay}`}),p(e(T),{Text:`{x:Bind Labels.DesktopShortcut, Mode=OneWay}`}),p(e(w),{Text:`{x:Bind Labels.CompressedFile, Mode=OneWay}`},{default:n(()=>[p(e(T),{Text:`{x:Bind Labels.CompressEmail, Mode=OneWay}`}),p(e(T),{Text:`{x:Bind Labels.Compress7z, Mode=OneWay}`}),p(e(T),{Text:`{x:Bind Labels.CompressZip, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(k.Output),p(k.Options)]),_:1}),p(k,{"x:Name":`Example3b`,SampleDefinition:`MenuFlyout\\MenuflyoutSplitmenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.SplitHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SplitXaml}`,CSharp:`{x:Bind SplitCSharp}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(b,{"x:Name":`Control3b`,class:`menu-example-row`,Orientation:`Horizontal`},{default:n(()=>[p(y,{Content:`{x:Bind Labels.FileOptions, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(C),{"x:Name":`SaveSplitItem`,Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.Save, Mode=OneWay}`},{default:n(()=>[p(e(C).Icon,null,{default:n(()=>[p(l,{Glyph:``})]),_:1}),p(e(T),{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveDocx, Mode=OneWay}`}),p(e(T),{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SavePdf, Mode=OneWay}`}),p(e(T),{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.SaveTxt, Mode=OneWay}`})]),_:1}),p(e(C),{Click:`SplitMenuFlyoutItem_Click`,Icon:`Share`,Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:n(()=>[p(e(T),{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareEmail, Mode=OneWay}`}),p(e(T),{Click:`SplitMenuFlyoutItem_Click`,Text:`{x:Bind Labels.ShareLink, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(h,{"x:Name":`Control3bOutput`,class:`menu-output`,Style:`{StaticResource OutputTextBlockStyle}`,Text:`{x:Bind SplitOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),p(k.Output),p(k.Options)]),_:1}),p(k,{"x:Name":`Example4`,SampleDefinition:`MenuFlyout\\MenuflyoutIcons.txt`,HeaderText:`{x:Bind Labels.IconsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind IconsXaml}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(y,{"x:Name":`Control4`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(T),{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:n(()=>[p(e(T).Icon,null,{default:n(()=>[p(l,{Glyph:``})]),_:1})]),_:1}),p(e(T),{Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`}),p(e(T),{Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`}),p(e(x)),p(e(T),{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),p(e(T),{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(k.Output),p(k.Options)]),_:1}),p(k,{"x:Name":`Example5`,FontFamily:`Segoe UI`,SampleDefinition:`MenuFlyout\\MenuflyoutIconsKeyboardAccelerators.txt`,Loaded:`Example5_Loaded`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(y,{"x:Name":`Control5`,Content:`{x:Bind Labels.EditOptions, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(T),{Text:`{x:Bind Labels.Share, Mode=OneWay}`},{default:n(()=>[p(e(T).Icon,null,{default:n(()=>[p(l,{Glyph:``})]),_:1}),p(e(T).KeyboardAccelerators,null,{default:n(()=>[p(e(D),{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),p(e(T),{FontFamily:`Consolas`,Icon:`Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`},{default:n(()=>[p(e(T).KeyboardAccelerators,null,{default:n(()=>[p(e(D),{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),p(e(T),{FontFamily:`Segoe UI`,Icon:`Delete`,Text:`{x:Bind Labels.Delete, Mode=OneWay}`},{default:n(()=>[p(e(T).KeyboardAccelerators,null,{default:n(()=>[p(e(D),{Key:`Delete`})]),_:1})]),_:1}),p(e(x)),p(e(T),{Text:`{x:Bind Labels.Rename, Mode=OneWay}`}),p(e(T),{Text:`{x:Bind Labels.Select, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(k.Output),p(k.Options)]),_:1}),p(k,{"x:Name":`Example6`,SampleDefinition:`MenuFlyout\\MenuflyoutRadiomenuflyoutitems.txt`,HeaderText:`{x:Bind Labels.RadioHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind RadioXaml}`},{default:n(()=>[p(k.Example,null,{default:n(()=>[p(y,{"x:Name":`Control6`,Content:`{x:Bind Labels.Options, Mode=OneWay}`},{default:n(()=>[p(y.Flyout,null,{default:n(()=>[p(A,null,{default:n(()=>[p(e(S),{GroupName:`OrientationGroup`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`}),p(e(S),{GroupName:`OrientationGroup`,IsChecked:`True`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`}),p(e(x)),p(e(S),{GroupName:`SizeGroup`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`}),p(e(S),{GroupName:`SizeGroup`,IsChecked:`True`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`}),p(e(S),{GroupName:`SizeGroup`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),p(k.Output),p(k.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-a73fd4c1`]]);export{B as default};