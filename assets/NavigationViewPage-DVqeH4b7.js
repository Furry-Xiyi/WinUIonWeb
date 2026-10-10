import{$ as e,$i as t,Ai as n,Bi as r,Cn as i,Cr as a,Ei as o,En as s,Ji as c,Mn as l,Ni as u,Sr as d,Wi as f,Yi as p,_i as m,bi as ee,bn as h,ci as g,dr as te,gi as _,hi as v,ki as y,mr as ne,nn as re,nr as ie,o as b,or as ae,p as x,t as S,ui as C,vi as w,wi as oe,yi as T}from"./ScrollViewer-B43ymvAj.js";import{t as se}from"./Button-B49t7g4C.js";import{i as ce,n as E,r as D,t as O}from"./NavigationView-D3DkomVv.js";import{o as k}from"./navigationTransitionInfo-urBlCpyK.js";import{t as A}from"./Frame-DNFR6F6t.js";import{t as j}from"./TextBox-Bab60qPV.js";import{t as le}from"./AutoSuggestBox-CSZyqXnk.js";import{t as ue}from"./HyperlinkButton-qCFKPDB4.js";import{t as M}from"./StackPanel-Dy6dKYi5.js";import{t as de}from"./ToggleButton-DDZy2gVz.js";import{t as N}from"./RadioButton-C9wpX0EH.js";import{t as fe}from"./RadioButtons-Cj9gy59V.js";import{t as P}from"./Ellipse-OjwGANef.js";import{t as F}from"./ControlExample-Ddvmn5_c.js";import{t as I}from"./CheckBox-fVMk0wr2.js";import{t as pe}from"./RichTextBlock-UWlhslHG.js";import{t as me}from"./pageState-BQHW0me4.js";import{n as L,t as he}from"./SamplePage2-DmpMKvN8.js";import{n as R,r as z,t as B}from"./SamplePage5-CcPPyoBz.js";var V=l(m({__name:`SamplePage6`,setup(e){let{t}=x();return g(()=>t(`sample.navigationview.lorem-title`)),g(()=>t(`sample.navigationview.lorem-body`)),g(()=>t(`sample.navigationview.lorem-short-body`)),g(()=>t(`sample.navigationview.settings-page`)),(e,t)=>{let n=u(`x:Double`),a=u(`ColumnDefinition`),o=u(`RowDefinition`);return y(),C(i,{Ignorable:`d`},{default:r(()=>[_(S,{class:`sample-page-scroll`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:r(()=>[_(s,null,{default:r(()=>[_(s.Resources,null,{default:r(()=>[_(n,{"x:Key":`TileHeight`},{default:r(()=>[...t[0]||=[v(`150`,-1)]]),_:1})]),_:1}),_(s.ColumnDefinitions,null,{default:r(()=>[_(a,{Width:`1*`}),_(a,{Width:`1*`}),_(a,{Width:`4*`})]),_:1}),_(s.RowDefinitions,null,{default:r(()=>[_(o,{Height:`Auto`}),_(o,{Height:`Auto`}),_(o,{Height:`Auto`}),_(o,{Height:`Auto`})]),_:1}),_(P,{"Grid.Row":`0`,"Grid.Column":`0`,Width:`20`,Height:`20`,Fill:`MediumTurquoise`}),_(P,{"Grid.Row":`0`,"Grid.Column":`1`,Width:`50`,Height:`50`,Fill:`SteelBlue`}),_(s,{"Grid.Row":`0`,"Grid.Column":`2`,MinHeight:`{StaticResource TileHeight}`,Margin:`5`,Background:`SkyBlue`}),_(P,{"Grid.Row":`1`,"Grid.Column":`0`,Width:`50`,Height:`50`,Fill:`PowderBlue`}),_(P,{"Grid.Row":`1`,"Grid.Column":`1`,Width:`20`,Height:`20`,Fill:`MediumTurquoise`}),_(s,{"Grid.Row":`1`,"Grid.Column":`2`,MinHeight:`{StaticResource TileHeight}`,Margin:`5`,Background:`SteelBlue`}),_(s,{"Grid.Row":`3`,"Grid.ColumnSpan":`3`,Margin:`5`},{default:r(()=>[_(b,{Text:`{x:Bind bodyText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-39db7f59`]]),H=l(m({__name:`SamplePage7`,setup(e){let{t}=x();return g(()=>t(`sample.navigationview.lorem-title`)),g(()=>t(`sample.navigationview.lorem-body`)),g(()=>t(`sample.navigationview.lorem-short-body`)),g(()=>t(`sample.navigationview.settings-page`)),(e,t)=>{let n=u(`x:Double`),a=u(`ColumnDefinition`),o=u(`RowDefinition`);return y(),C(i,{Ignorable:`d`},{default:r(()=>[_(S,{class:`sample-page-scroll`,VerticalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:r(()=>[_(s,null,{default:r(()=>[_(s.Resources,null,{default:r(()=>[_(n,{"x:Key":`TileHeight`},{default:r(()=>[...t[0]||=[v(`150`,-1)]]),_:1})]),_:1}),_(s.ColumnDefinitions,null,{default:r(()=>[_(a,{Width:`Auto`}),_(a,{Width:`*`})]),_:1}),_(s.RowDefinitions,null,{default:r(()=>[_(o,{Height:`Auto`}),_(o,{Height:`Auto`})]),_:1}),_(s,{"x:Name":`DestinationElement`,"Grid.Row":`1`,"Grid.Column":`0`,Width:`150`,Height:`200`,MinHeight:`{StaticResource TileHeight}`,Margin:`12`,VerticalAlignment:`Top`,Background:`PaleVioletRed`}),_(M,{"x:Name":`ContentPanel`,"Grid.Row":`1`,"Grid.Column":`1`,MinHeight:`200`,Margin:`12`},{default:r(()=>[_(b,{Margin:`0,0,0,12`,Style:`{ThemeResource TitleTextBlockStyle}`,Text:`{x:Bind titleText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(b,{Text:`{x:Bind bodyText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-53f1e374`]]),U=l(m({__name:`SampleSettingsPage`,setup(e){let{t}=x();return g(()=>t(`sample.navigationview.lorem-title`)),g(()=>t(`sample.navigationview.lorem-body`)),g(()=>t(`sample.navigationview.lorem-short-body`)),g(()=>t(`sample.navigationview.settings-page`)),(e,t)=>(y(),C(i,{Ignorable:`d`},{default:r(()=>[_(s,null,{default:r(()=>[_(b,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Style:`{StaticResource TitleTextBlockStyle}`,Text:`{x:Bind settingsPageText, Mode=OneWay}`})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-8900d620`]]),ge=l(m({__name:`NavigationViewSamplePage`,props:{Page:{type:String,default:`SamplePage1`},NavigationVersion:{type:Number,default:0},NavigationTransitionInfo:{type:Object,default:()=>k()}},setup(e){let n=e,r={SamplePage1:L,SamplePage2:he,SamplePage3:z,SamplePage4:R,SamplePage5:B,SamplePage6:V,SamplePage7:H,SampleSettingsPage:U},i=g(()=>r[n.Page]??L),a=m({setup(){return()=>T(`div`,{class:`navigationview-sample-page-host`},[T(i.value)])}});return(e,n)=>(y(),C(t(a)))}}),[[`__scopeId`,`data-v-e00788d5`]]),_e=`--- header
NavigationView with default PaneDisplayMode
--- xaml
<NavigationView x:Name="nvSample">
    <NavigationView.MenuItems>
        <NavigationViewItem Icon="Play" Content="Menu Item1" Tag="SamplePage1" />
        <NavigationViewItem Icon="Save" Content="Menu Item2" Tag="SamplePage2" />
        <NavigationViewItem Icon="Refresh" Content="Menu Item3" Tag="SamplePage3" />
        <NavigationViewItem Icon="Download" Content="Menu Item4" Tag="SamplePage4" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>`,ve=`--- header
NavigationView with PaneDisplayMode set to Top
--- xaml
<NavigationView x:Name="nvSample" Header="This is Header Text" PaneDisplayMode="Top">
    <NavigationView.MenuItems>
        <NavigationViewItem  Content="Menu Item1" Tag="SamplePage1" />
        <NavigationViewItem  Content="Menu Item2" Tag="SamplePage2" />
        <NavigationViewItem  Content="Menu Item3" Tag="SamplePage3" />
        <NavigationViewItem  Content="Menu Item4" Tag="SamplePage4" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>`,ye=`--- header
NavigationView that switches pane orientation based on window width
--- xaml
<!-- Put the following VisualStateGroup(s) inside the first component of your Page -->
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup>
        <VisualState>
            <VisualState.StateTriggers>
                <AdaptiveTrigger MinWindowWidth="{x:Bind nvSample.CompactModeThresholdWidth}" />
            </VisualState.StateTriggers>
            <VisualState.Setters>
                <Setter Target="nvSample.PaneDisplayMode" Value="Top" />
            </VisualState.Setters>
        </VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups >

<NavigationView x:Name="nvSample">
    <NavigationView.MenuItems>
        <NavigationViewItem Content="Menu Item1" Tag="SamplePage1" />
        <NavigationViewItem Content="Menu Item2" Tag="SamplePage2" />
        <NavigationViewItem Content="Menu Item3" Tag="SamplePage3" />
        <NavigationViewItem Content="Menu Item4" Tag="SamplePage4" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>`,W=`--- header
Tying selection and focus - Tabs
--- xaml
<NavigationView x:Name="nvSample" PaneDisplayMode="Top" 
    SelectionFollowsFocus="Enabled" IsBackButtonVisible="Collapsed">
    <NavigationView.MenuItems>
        <NavigationViewItem Icon="Play" Content="Item1" x:Name="SamplePage1Item" />
        <NavigationViewItem Icon="Save" Content="Item2" x:Name="SamplePage2Item" />
        <NavigationViewItem Icon="Refresh" Content="Item3" x:Name="SamplePage3Item" />
        <NavigationViewItem Icon="Download" Content="Item4" x:Name="SamplePage4Item" />
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame"/>
</NavigationView>
--- c#
//C# code behind
private void NavView_ItemInvoked(NavigationView sender, NavigationViewItemInvokedEventArgs args)
{
    FrameNavigationOptions navOptions = new FrameNavigationOptions();
    navOptions.TransitionInfoOverride = args.RecommendedNavigationTransitionInfo;
    if (sender.PaneDisplayMode == NavigationViewPaneDisplayMode.Top)
    {
        navOptions.IsNavigationStackEnabled = False;
    }
    Type pageType;
    if (args.InvokedItem == SamplePage1Item) 
    {
        pageType = typeof(SamplePage1);
    }
    else if (args.InvokedItem == SamplePage2Item) 
    {
        pageType = typeof(SamplePage2);
    }
    else if (args.InvokedItem == SamplePage3Item) 
    {
        pageType = typeof(SamplePage3);
    }
    else if (args.InvokedItem == SamplePage4Item) 
    {
        pageType = typeof(SamplePage4);
    }
    ContentFrame.NavigateToType(pageType, null, navOptions);
}`,G=`--- header
Data binding
--- xaml
<NavigationView x:Name="nvSample" 
                MenuItemTemplateSelector="{StaticResource selector}" 
                MenuItemsSource="{x:Bind Categories, Mode=OneWay}" />
 
<local:MenuItemTemplateSelector x:Key="selector"> 
    <local:MenuItemTemplateSelector.ItemTemplate> 
        <DataTemplate x:DataType="local:Category" > 
            <NavigationViewItem Content="{x:Bind Name}" ToolTipService.ToolTip="{x:Bind Tooltip}"> 
                <NavigationViewItem.Icon> 
                    <SymbolIcon Symbol="{x:Bind Glyph}" /> 
                </NavigationViewItem.Icon> 
            </NavigationViewItem>
        </DataTemplate> 
    </local:MenuItemTemplateSelector.ItemTemplate > 
</local:MenuItemTemplateSelector>
--- c#
//C# code behind
Categories = new ObservableCollection<CategoryBase>(); 
Categories.Add(new Category { Name = "Category 1", Glyph = Symbol.Home, Tooltip = "This is category 1" }); 
Categories.Add(new Category { Name = "Category 2", Glyph = Symbol.Keyboard, Tooltip = "This is category 2" }); 
Categories.Add(new Category { Name = "Category 3", Glyph = Symbol.Library, Tooltip = "This is category 3" }); 
Categories.Add(new Category { Name = "Category 4", Glyph = Symbol.Mail, Tooltip = "This is category 4" }); 

public class CategoryBase { } 

public class Category : CategoryBase
{
    public string Name { get; set; } = string.Empty;
    public string Tooltip { get; set; } = string.Empty;
    public Symbol Glyph { get; set; }
}

public class Separator : CategoryBase { }

public class Header : CategoryBase
{
    public string Name { get; set; }
}

[ContentProperty(Name = "ItemTemplate")]
class MenuItemTemplateSelector : DataTemplateSelector
{
    public DataTemplate? ItemTemplate { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        return item is Separator ? SeparatorTemplate : item is Header ? HeaderTemplate : ItemTemplate;
    }
}`,be=`--- header
NavigationView with Footer Menu Items
--- xaml
<NavigationView x:Name="nvSample9" 
                            Header="This is Header Text" 
                            PaneDisplayMode="$(PaneDisplay)" 
                            SelectionChanged="NavigationView_SelectionChanged9"
                            IsSettingsVisible="False">
        <NavigationView.MenuItems>
            <NavigationViewItem Content="Browse" Tag="SamplePage1" Icon="Library" />
            <NavigationViewItem Content="Track an Order" Tag="SamplePage2" Icon="Map" />
            <NavigationViewItem Content="Order History" Tag="SamplePage3" Icon="Tag" />
        </NavigationView.MenuItems>
        <NavigationView.FooterMenuItems>
            <NavigationViewItem Content="Account" Tag="SamplePage4" Icon="Contact" />
            <NavigationViewItem Content="Your Cart" Tag="SamplePage5" Icon="Shop" />
            <NavigationViewItem Content="Help" Tag="SamplePage5" Icon="Help" />
        </NavigationView.FooterMenuItems>
    <Frame x:Name="contentFrame9" />
</NavigationView>`,xe=`--- header
Hierarchical NavigationView
--- xaml
<NavigationView x:Name="nvSample8" Grid.Row="1" Height="460"
                        PaneDisplayMode="$(PaneDisplay)" 
                        IsTabStop="False" 
                        SelectionChanged="NavigationView_SelectionChanged8">
    <NavigationView.MenuItems>
        <NavigationViewItem Content="Home" Icon="Home" ToolTipService.ToolTip="Home" Tag="SamplePage1"/>
        <NavigationViewItem Content="Account" Icon="Contact" ToolTipService.ToolTip="Account" Tag="SamplePage2">
            <NavigationViewItem.MenuItems>
                <NavigationViewItem Content="Mail" Icon="Mail" ToolTipService.ToolTip="Mail" Tag="SamplePage3"/>
                <NavigationViewItem Content="Calendar" Icon="Calendar" ToolTipService.ToolTip="Calendar" Tag="SamplePage4"/>
            </NavigationViewItem.MenuItems>
        </NavigationViewItem>
        <NavigationViewItem Content="Document options" Icon="Page2" ToolTipService.ToolTip="Document options" SelectsOnInvoked="False">
            <NavigationViewItem.MenuItems>
                <NavigationViewItem Content="Create new" Icon="NewFolder" ToolTipService.ToolTip="Create new" Tag="SamplePage5"/>
                <NavigationViewItem Content="Upload file" Icon="OpenLocal" ToolTipService.ToolTip="Upload file" Tag="SamplePage6"/>
            </NavigationViewItem.MenuItems>
        </NavigationViewItem>
    </NavigationView.MenuItems>
    <Frame x:Name="contentFrame8" />
</NavigationView>`,Se=`--- header
API in action
--- xaml
<NavigationView x:Name="nvSample"
    IsSettingsVisible="$(SettingsVis)"
    IsBackButtonVisible="$(BackButtonVis)"
    IsBackEnabled="$(BackButtonEn)"
    SelectionChanged="NavigationView_SelectionChanged"
    Header="$(HeaderText)"
    AlwaysShowHeader="$(ShowHeader)"
    PaneTitle="$(PaneTitleText)"
    PaneDisplayMode="$(PaneDisplayMode)" 
    ExpandedModeThresholdWidth="500"
    SelectionFollowsFocus="$(SelectionFollowsFocus)"
    IsTabStop="False">
                    
    <NavigationView.MenuItems>
        <NavigationViewItem Content="Menu Item1" Tag="SamplePage1" x:Name="SamplePage1Item">
            <NavigationViewItem.Icon>
                <SymbolIcon Symbol="Play" />
            </NavigationViewItem.Icon>
        </NavigationViewItem>
        <NavigationViewItemHeader Content="Actions"/>
        <NavigationViewItem Content="Menu Item2" Tag="SamplePage2" x:Name="SamplePage2Item" SelectsOnInvoked="$(SelectsOnInvoked)">
            <NavigationViewItem.Icon>
                <SymbolIcon Symbol="Save" />
            </NavigationViewItem.Icon>
        </NavigationViewItem>
        <NavigationViewItem Content="Menu Item3" Tag="SamplePage3" x:Name="SamplePage3Item">
            <NavigationViewItem.Icon>
                <SymbolIcon Symbol="Refresh" />
            </NavigationViewItem.Icon>
        </NavigationViewItem>
    </NavigationView.MenuItems>
                    
    <NavigationView.PaneCustomContent>
        <HyperlinkButton x:Name="PaneHyperlink" Content="More info" Margin="12,0" Visibility="$(PaneCustomContentVis)" />
    </NavigationView.PaneCustomContent>
    $(NavViewASB)
    <NavigationView.PaneFooter>
        <StackPanel x:Name="FooterStackPanel" Orientation="Vertical" Visibility="$(PaneFooterVis)">
            <NavigationViewItem Icon="Download" AutomationProperties.Name="download" />
            <NavigationViewItem Icon="Favorite" AutomationProperties.Name="favorite" />
        </StackPanel>
    </NavigationView.PaneFooter>

    <Frame x:Name="contentFrame" />
</NavigationView>`,K=l(m({name:`NavigationViewPage`,__name:`NavigationViewPage`,setup(l){let{t:v}=x(),{isFavoriteState:k,pageTheme:P,toggleTheme:L,toggleFavorite:he}=me(ee(`currentPage`,null)?.value||`navigationview`),R=p({});n(te,R);let z={Description:`text.navigationview-description`,DefaultHeader:`sample.navigationview.default-header`,TopHeader:`sample.navigationview.top-header`,AdaptiveHeader:`sample.navigationview.adaptive-header`,TabsHeader:`sample.navigationview.tabs-header`,DataBindingHeader:`sample.navigationview.data-binding-header`,FooterHeader:`sample.navigationview.footer-header`,HierarchicalHeader:`sample.navigationview.hierarchical-header`,ApiHeader:`sample.navigationview.api-header`,DefaultDescription:`sample.navigationview.default-description`,TopDescription:`sample.navigationview.top-description`,AdaptiveDescription:`sample.navigationview.adaptive-description`,TabsDescription:`sample.navigationview.tabs-description`,DataBindingDescription:`sample.navigationview.data-binding-description`,FooterDescription:`sample.navigationview.footer-description`,HierarchyDescription1:`sample.navigationview.hierarchy-description-1`,HierarchyDescription2:`sample.navigationview.hierarchy-description-2`,HierarchyDescription3:`sample.navigationview.hierarchy-description-3`,HierarchyDescription4:`sample.navigationview.hierarchy-description-4`,HeaderText:`sample.navigationview.header-text`,MenuItem1:`sample.navigationview.menu-item-1`,MenuItem2:`sample.navigationview.menu-item-2`,MenuItem3:`sample.navigationview.menu-item-3`,MenuItem4:`sample.navigationview.menu-item-4`,Item1:`sample.navigationview.item-1`,Item2:`sample.navigationview.item-2`,Item3:`sample.navigationview.item-3`,Item4:`sample.navigationview.item-4`,SamplePage:`sample.navigationview.sample-page`,SettingsPage:`sample.navigationview.settings-page`,LoremTitle:`sample.navigationview.lorem-title`,LoremBody:`sample.navigationview.lorem-body`,Category:`sample.navigationview.category`,CategoryTooltip:`sample.navigationview.category-tooltip`,Browse:`sample.navigationview.browse`,TrackOrder:`sample.navigationview.track-order`,OrderHistory:`sample.navigationview.order-history`,Account:`sample.navigationview.account`,YourCart:`sample.navigationview.your-cart`,Help:`sample.navigationview.help`,PanePosition:`sample.navigationview.pane-position`,PanePositionProperty:`sample.navigationview.pane-position-property`,LeftMode:`sample.navigationview.left-mode`,TopMode:`sample.navigationview.top-mode`,LeftCompactMode:`sample.navigationview.left-compact-mode`,Home:`sample.navigationview.home`,Mail:`sample.navigationview.mail`,Calendar:`sample.navigationview.calendar`,DocumentOptions:`sample.navigationview.document-options`,CreateNew:`sample.navigationview.create-new`,UploadFile:`sample.navigationview.upload-file`,SettingsVisible:`sample.navigationview.settings-visible`,BackVisible:`sample.navigationview.back-visible`,BackEnabled:`sample.navigationview.back-enabled`,AutosuggestVisible:`sample.navigationview.autosuggest-visible`,HeaderLabel:`sample.navigationview.header-label`,HeaderValue:`sample.navigationview.header-value`,AlwaysShowHeader:`sample.navigationview.always-show-header`,PaneTitleLabel:`sample.navigationview.pane-title-label`,PaneTitleValue:`sample.navigationview.pane-title-value`,PaneCustomVisible:`sample.navigationview.pane-custom-visible`,PaneFooterVisible:`sample.navigationview.pane-footer-visible`,Left:`sample.navigationview.left`,Top:`sample.navigationview.top`,KeyboardSelectionFollowsFocus:`sample.navigationview.keyboard-selection-follows-focus`,SuppressMenuItem2:`sample.navigationview.suppress-menu-item-2`,Actions:`sample.navigationview.actions`,MoreInfo:`sample.navigationview.more-info`,Search:`sample.navigationview.search`,Download:`sample.navigationview.download`,Favorite:`sample.navigationview.favorite`,ChangeTheme:`sample.navigationview.change-theme`,AddFavorite:`sample.navigationview.add-favorite`,RemoveFavorite:`sample.navigationview.remove-favorite`,HeaderProperty:`sample.navigationview.header-property`,PaneTitleProperty:`sample.navigationview.pane-title-property`,LoremShortBody:`sample.navigationview.lorem-short-body`},B=g(()=>Object.fromEntries(Object.entries(z).map(([e,t])=>[e,v(t)])));g(()=>v(`text.navigationview`)),g(()=>v(`text.navigationview-description`)),g(()=>v(k.value?`sample.navigationview.remove-favorite`:`sample.navigationview.add-favorite`)),g(()=>k.value?``:``);let V=m({name:`Paragraph`,setup(e,{slots:t}){let n=w();return()=>T(`p`,ie(t.default?.()??[],n))}}),H=m({name:`Run`,props:{Text:{type:String,default:``}},setup(e){let t=w();return()=>T(`span`,String(ae(e.Text,t)??``))}}),U=m({name:`LineBreak`,setup:()=>()=>T(`br`)}),K=e=>m({name:e,setup:()=>()=>null}),Ce={VisualStateGroups:K(`VisualStateManager.VisualStateGroups`)},we=K(`VisualStateGroup`),q=Object.assign(K(`VisualState`),{StateTriggers:K(`VisualState.StateTriggers`),Setters:K(`VisualState.Setters`)}),Te=K(`AdaptiveTrigger`),Ee=K(`Setter`),J=g(()=>[`Home`,`Keyboard`,`Library`,`Mail`].map((e,t)=>({Name:v(`sample.navigationview.category`,{number:t+1}),Tooltip:v(`sample.navigationview.category-tooltip`,{number:t+1}),Glyph:e,Number:t+1}))),De=Object.fromEntries([`SamplePage1`,`SamplePage2`,`SamplePage3`,`SamplePage4`,`SamplePage5`,`SamplePage6`,`SamplePage7`,`SampleSettingsPage`].map(e=>[e,f(m({name:e,props:[`Parameter`,`NavigationTransitionInfo`,`NavigationVersion`],setup(t){return()=>T(ge,{Page:e,NavigationTransitionInfo:t.NavigationTransitionInfo,NavigationVersion:t.NavigationVersion})}}))])),Y=p({});g(()=>Object.fromEntries([`Default`,`Top`,`Adaptive`,`Tabs`,`DataBinding`,`Footer`,`Hierarchy`,`Api`].map(e=>{let t=Y[e],n=t?.Page===`SampleSettingsPage`?v(`sample.navigationview.settings-page`):v(`sample.navigationview.sample-page`,{number:t?.Page.match(/(\d+)$/)?.[1]??``});return[e,t?v(`sample.navigationview.selection-output`,{item:t.Item,page:n}):v(`sample.navigationview.no-selection`)]})));let X=(e,t,n,r,i,a=!1,o=!1,s=!1)=>{if(!i?.SelectedItem&&!i?.IsSettingsSelected){delete Y[e];return}let c=i.SelectedItem,l=i.IsSettingsSelected?`SampleSettingsPage`:o?`SamplePage1`:c.Tag,u=De[l],d=R[t]??r,f=R[n];!u||!f||(e===`Tabs`?f.NavigateToType?.(u,null,{TransitionInfoOverride:i.RecommendedNavigationTransitionInfo,IsNavigationStackEnabled:!1}):f.Navigate?.(u,null,s?i.RecommendedNavigationTransitionInfo:null))&&(a&&!i.IsSettingsSelected&&(d.Header=v(`sample.navigationview.sample-page`,{number:o?c.Number??String(c.Name).match(/(\d+)$/)?.[1]:String(l).match(/(\d+)$/)?.[1]})),Y[e]={Item:i.IsSettingsSelected?v(`sample.navigationview.settings-item`):String(c.Content??c.Name??``),Page:l})},Oe=(e,t=e)=>X(`Default`,`nvSample5`,`contentFrame5`,e,t,!0),ke=(e,t=e)=>X(`Top`,`nvSample6`,`contentFrame6`,e,t),Ae=(e,t=e)=>X(`Adaptive`,`nvSample2`,`contentFrame2`,e,t),je=(e,t=e)=>X(`Tabs`,`nvSample7`,`contentFrame7`,e,t,!1,!1,!0),Me=(e,t=e)=>X(`DataBinding`,`nvSample4`,`contentFrame4`,e,t,!0,!0),Ne=(e,t=e)=>X(`Footer`,`nvSample9`,`contentFrame9`,e,t,!1,!1,!0),Pe=(e,t=e)=>X(`Hierarchy`,`nvSample8`,`contentFrame8`,e,t,!0),Fe=c(!0),Ie=c(`Collapsed`),Le=c(`Collapsed`);c(`Vertical`);let Re=c(!0),Z=()=>{let e=R.nvSample2;e&&(e.PaneDisplayMode=window.innerWidth>=Number(e.CompactModeThresholdWidth??641)?`Top`:`Auto`)},ze=()=>{R.navViewASB&&(R.navViewASB.Value=Fe.value?`
    <NavigationView.AutoSuggestBox>
        <AutoSuggestBox QueryIcon="Find" AutomationProperties.Name="Search" />
    </NavigationView.AutoSuggestBox>
`:``)},Be=[[`nvSample2`,Ae],[`nvSample5`,Oe],[`nvSample6`,ke],[`nvSample7`,je],[`nvSample8`,Pe],[`nvSample9`,Ne]];o(()=>{for(let[e,t]of Be){let n=R[e],r=n?.MenuItems?.[0];r&&(n.SelectedItem=r,R[e.replace(`nvSample`,`contentFrame`)]?.CurrentSourcePageType||t(n,{SelectedItem:r,IsSettingsSelected:!1}))}R.nvSample4&&(R.nvSample4.SelectedItem=J.value[0],R.contentFrame4?.CurrentSourcePageType||Me(R.nvSample4,{SelectedItem:J.value[0],IsSettingsSelected:!1})),R.nvSample?.AutoSuggestBox,ze(),Z(),window.addEventListener(`resize`,Z)}),oe(()=>window.removeEventListener(`resize`,Z));let Ve={Default:_e,Top:ve,Adaptive:ye,Tabs:W,DataBinding:G,Footer:be,Hierarchy:xe,Api:Se},Q=(e,t)=>[...e.matchAll(/--- (header|xaml|c#)\s*\r?\n([\s\S]*?)(?=\r?\n--- |$)/g)].find(e=>e[1]===t)?.[2]?.trim()??``,$=e=>String(e??``).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return g(()=>{let e=R.nvSample,t={SettingsVis:e?.IsSettingsVisible??!0,BackButtonVis:e?.IsBackButtonVisible??`Auto`,BackButtonEn:e?.IsBackEnabled??!1,HeaderText:e?.Header??B.value.HeaderValue,ShowHeader:e?.AlwaysShowHeader??!0,PaneTitleText:e?.PaneTitle??B.value.PaneTitleValue,PaneCustomContentVis:Ie.value,PaneFooterVis:Le.value,PaneDisplayMode:e?.PaneDisplayMode??`Left`,SelectionFollowsFocus:e?.SelectionFollowsFocus??`Disabled`,SelectsOnInvoked:Re.value,NavViewASB:Fe.value?`
    <NavigationView.AutoSuggestBox>
        <AutoSuggestBox QueryIcon="Find" AutomationProperties.Name="Search" />
    </NavigationView.AutoSuggestBox>
`:``};return Object.fromEntries(Object.entries(Ve).map(([e,n])=>[e,Q(n,`xaml`).replace(/\$\((\w+)\)/g,(n,r)=>{if(r===`PaneDisplay`)return $(e===`Footer`?R.nvSample9?.PaneDisplayMode??`Left`:R.nvSample8?.PaneDisplayMode??`Left`);if(r===`NavViewASB`)return String(t[r]??``);let i=t[r];return $(typeof i==`boolean`?i?`True`:`False`:i)})]))}),g(()=>({Tabs:Q(W,`c#`),DataBinding:Q(G,`c#`)})),(n,o)=>{let c=u(`RowDefinition`);return y(),C(i,{"xmlns:models":`using:WinUIGallery.Models`,"xmlns:converters":`using:WinUIGallery.Converters`},{default:r(()=>[_(i.Resources,null,{default:r(()=>[_(t(E),{"x:Key":`selector`},{default:r(()=>[_(t(E).ItemTemplate,null,{default:r(()=>[_(t(re),{"x:DataType":`models:Category`},{default:r(()=>[_(t(D),{Content:`{x:Bind Name}`,"ToolTipService.ToolTip":`{x:Bind Tooltip}`},{default:r(()=>[_(t(D).Icon,null,{default:r(()=>[_(e,{Symbol:`{x:Bind Glyph}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),_(S,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[_(M,{class:`gallery-item-page`},{default:r(()=>[_(M,{class:`page-heading`},{default:r(()=>[_(b,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),_(b,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(M,{class:`page-header-actions`,Orientation:`Horizontal`},{default:r(()=>[_(se,{class:`header-action`,"AutomationProperties.Name":`{x:Bind Labels.ChangeTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ChangeTheme, Mode=OneWay}`,Click:`toggleTheme`},{default:r(()=>[_(b,{class:`icon`,Text:``})]),_:1}),_(de,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonName, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteButtonName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:r(()=>[_(b,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),_(M,{class:`gallery-page-content navigationview-samples`,Spacing:`0`},{default:r(()=>[_(M.Resources,null,{default:r(()=>[_(t(d),null,{default:r(()=>[_(t(d).ThemeDictionaries,null,{default:r(()=>[_(t(d),{"x:Key":`Light`},{default:r(()=>[_(t(a),{"x:Key":`myBrush`,Color:`{StaticResource SystemBaseHighColor}`}),_(t(ne),{"x:Key":`NavigationViewExpandedPaneBackground`,FallbackColor:`#F2F2F2`,TintColor:`White`,TintOpacity:`0.8`})]),_:1}),_(t(d),{"x:Key":`Dark`},{default:r(()=>[_(t(a),{"x:Key":`myBrush`,Color:`{StaticResource SystemBaseHighColor}`}),_(t(ne),{"x:Key":`NavigationViewExpandedPaneBackground`,FallbackColor:`#1F1F1F`,TintColor:`#1F1F1F`,TintOpacity:`0.8`})]),_:1}),_(t(d),{"x:Key":`HighContrast`},{default:r(()=>[_(t(a),{"x:Key":`myBrush`,Color:`{ThemeResource SystemColorButtonFaceColor}`})]),_:1})]),_:1})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationviewDefaultPanedisplaymode.txt`,WebViewHeight:`250`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.DefaultHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Default, Mode=OneWay}`},{default:r(()=>[_(F.Example,null,{default:r(()=>[_(s,{class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c,{Height:`Auto`}),_(c,{Height:`Auto`})]),_:1}),_(b,{Margin:`0,0,0,12`,Text:`{x:Bind Labels.DefaultDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(O,{"x:Name":`nvSample5`,"Grid.Row":`1`,Height:`460`,Header:`{x:Bind Labels.HeaderText, Mode=OneWay}`,IsTabStop:`False`,PaneDisplayMode:`Auto`,SelectionChanged:`NavigationView_SelectionChanged5`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.MenuItem1, Mode=OneWay}`,Icon:`Play`,Tag:`SamplePage1`}),_(t(D),{Content:`{x:Bind Labels.MenuItem2, Mode=OneWay}`,Icon:`Save`,Tag:`SamplePage2`}),_(t(D),{Content:`{x:Bind Labels.MenuItem3, Mode=OneWay}`,Icon:`Refresh`,Tag:`SamplePage3`}),_(t(D),{Content:`{x:Bind Labels.MenuItem4, Mode=OneWay}`,Icon:`Download`,Tag:`SamplePage4`})]),_:1}),_(A,{"x:Name":`contentFrame5`,Margin:`0,0,0,0`})]),_:1})]),_:1})]),_:1}),_(F.Options),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Default, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationviewPanedisplaymodeTop.txt`,WebViewHeight:`200`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.TopHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Top, Mode=OneWay}`},{default:r(()=>[_(F.Example,null,{default:r(()=>[_(s,{class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c,{Height:`Auto`}),_(c)]),_:1}),_(b,{Margin:`0,0,0,12`,Text:`{x:Bind Labels.TopDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(O,{"x:Name":`nvSample6`,"Grid.Row":`1`,Height:`460`,Header:`{x:Bind Labels.HeaderText, Mode=OneWay}`,IsTabStop:`False`,PaneDisplayMode:`Top`,SelectionChanged:`NavigationView_SelectionChanged6`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.MenuItem1, Mode=OneWay}`,Tag:`SamplePage1`}),_(t(D),{Content:`{x:Bind Labels.MenuItem2, Mode=OneWay}`,Tag:`SamplePage2`}),_(t(D),{Content:`{x:Bind Labels.MenuItem3, Mode=OneWay}`,Tag:`SamplePage3`}),_(t(D),{Content:`{x:Bind Labels.MenuItem4, Mode=OneWay}`,Tag:`SamplePage3`})]),_:1}),_(A,{"x:Name":`contentFrame6`})]),_:1})]),_:1})]),_:1}),_(F.Options),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Top, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationviewSwitchesPaneOrientation.txt`,WebViewHeight:`450`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.AdaptiveHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Adaptive, Mode=OneWay}`},{default:r(()=>[_(F.Example,null,{default:r(()=>[_(s,{"x:Name":`InnerGrid`,class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c,{Height:`Auto`}),_(c,{Height:`Auto`})]),_:1}),_(b,{Margin:`0,0,0,12`,Text:`{x:Bind Labels.AdaptiveDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(O,{"x:Name":`nvSample2`,"Grid.Row":`1`,Height:`460`,IsTabStop:`False`,PaneDisplayMode:`Auto`,SelectionChanged:`NavigationView_SelectionChanged2`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.MenuItem1, Mode=OneWay}`,Tag:`SamplePage1`}),_(t(D),{Content:`{x:Bind Labels.MenuItem2, Mode=OneWay}`,Tag:`SamplePage2`}),_(t(D),{Content:`{x:Bind Labels.MenuItem3, Mode=OneWay}`,Tag:`SamplePage3`}),_(t(D),{Content:`{x:Bind Labels.MenuItem4, Mode=OneWay}`,Tag:`SamplePage4`})]),_:1}),_(O.Content,null,{default:r(()=>[_(A,{"x:Name":`contentFrame2`})]),_:1})]),_:1})]),_:1})]),_:1}),_(F.Options),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Adaptive, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationViewTyingSelectionFocusTabs.txt`,WebViewHeight:`800`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.TabsHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Tabs, Mode=OneWay}`,CSharp:`{x:Bind SampleCSharp.Tabs, Mode=OneWay}`},{default:r(()=>[_(F.Example,null,{default:r(()=>[_(s,{class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c,{Height:`Auto`}),_(c,{Height:`Auto`})]),_:1}),_(b,{Margin:`0,0,0,12`,Text:`{x:Bind Labels.TabsDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(O,{"x:Name":`nvSample7`,"Grid.Row":`1`,Height:`460`,IsBackButtonVisible:`Collapsed`,IsTabStop:`False`,PaneDisplayMode:`Top`,SelectionChanged:`NavigationView_SelectionChanged7`,SelectionFollowsFocus:`Enabled`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.Item1, Mode=OneWay}`,Tag:`SamplePage1`}),_(t(D),{Content:`{x:Bind Labels.Item2, Mode=OneWay}`,Tag:`SamplePage2`}),_(t(D),{Content:`{x:Bind Labels.Item3, Mode=OneWay}`,Tag:`SamplePage3`}),_(t(D),{Content:`{x:Bind Labels.Item4, Mode=OneWay}`,Tag:`SamplePage4`})]),_:1}),_(A,{"x:Name":`contentFrame7`})]),_:1})]),_:1})]),_:1}),_(F.Options),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Tabs, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationViewDataBinding.txt`,WebViewHeight:`950`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.DataBindingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.DataBinding, Mode=OneWay}`,CSharp:`{x:Bind SampleCSharp.DataBinding, Mode=OneWay}`},{default:r(()=>[_(F.Example,null,{default:r(()=>[_(s,{class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c),_(c,{Height:`Auto`})]),_:1}),_(b,{Margin:`0,0,0,12`,Text:`{x:Bind Labels.DataBindingDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(O,{"x:Name":`nvSample4`,"Grid.Row":`1`,Height:`460`,IsTabStop:`False`,MenuItemTemplateSelector:`{StaticResource selector}`,MenuItemsSource:`{x:Bind Categories, Mode=OneWay}`,SelectionChanged:`NavigationView_SelectionChanged4`,class:`navigationview-sample`},{default:r(()=>[_(M,null,{default:r(()=>[_(A,{"x:Name":`contentFrame4`,Margin:`0,0,0,0`})]),_:1})]),_:1})]),_:1})]),_:1}),_(F.Options),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.DataBinding, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationviewFooterMenuItems.txt`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.FooterHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Footer, Mode=OneWay}`},{default:r(()=>[_(F.Options,null,{default:r(()=>[_(M,null,{default:r(()=>[_(fe,{Header:`{x:Bind Labels.PanePosition, Mode=OneWay}`,SelectedIndex:`0`},{default:r(()=>[_(N,{"x:Name":`nvSample9Left`,Checked:`panePositionLeft_Checked`,Content:`{x:Bind Labels.LeftMode, Mode=OneWay}`}),_(N,{"x:Name":`nvSample9Top`,Checked:`panePositionTop_Checked`,Content:`{x:Bind Labels.TopMode, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),_(F.Substitutions,null,{default:r(()=>[_(t(h),{Key:`PaneDisplay`,Value:`{x:Bind nvSample9.PaneDisplayMode, Mode=OneWay}`})]),_:1}),_(F.Example,null,{default:r(()=>[_(s,{class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c),_(c,{Height:`Auto`})]),_:1}),_(b,{Margin:`0,0,0,12`,Text:`{x:Bind Labels.FooterDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),_(O,{"x:Name":`nvSample9`,"Grid.Row":`1`,Height:`460`,Header:`{x:Bind Labels.HeaderText, Mode=OneWay}`,IsSettingsVisible:`False`,IsTabStop:`False`,PaneDisplayMode:`Left`,SelectionChanged:`NavigationView_SelectionChanged9`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.Browse, Mode=OneWay}`,Icon:`Library`,Tag:`SamplePage1`}),_(t(D),{Content:`{x:Bind Labels.TrackOrder, Mode=OneWay}`,Icon:`Map`,Tag:`SamplePage2`}),_(t(D),{Content:`{x:Bind Labels.OrderHistory, Mode=OneWay}`,Icon:`Tag`,Tag:`SamplePage3`})]),_:1}),_(O.FooterMenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.Account, Mode=OneWay}`,Icon:`Contact`,Tag:`SamplePage4`}),_(t(D),{Content:`{x:Bind Labels.YourCart, Mode=OneWay}`,Icon:`Shop`,Tag:`SamplePage5`}),_(t(D),{Content:`{x:Bind Labels.Help, Mode=OneWay}`,Icon:`Help`,Tag:`SamplePage5`})]),_:1}),_(A,{"x:Name":`contentFrame9`,Margin:`0,0,0,0`})]),_:1})]),_:1})]),_:1}),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Footer, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\HierarchicalNavigationview.txt`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.HierarchicalHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Hierarchy, Mode=OneWay}`},{default:r(()=>[_(F.Options,null,{default:r(()=>[_(M,null,{default:r(()=>[_(b,{Margin:`0,12,0,0`,Text:`{x:Bind Labels.PanePositionProperty, Mode=OneWay}`}),_(N,{"x:Name":`nvSample8Left`,Checked:`panePositionLeft_Checked`,Content:`{x:Bind Labels.LeftMode, Mode=OneWay}`,GroupName:`hierachicalGroup`,IsChecked:`True`}),_(N,{"x:Name":`nvSample8Top`,Checked:`panePositionTop_Checked`,Content:`{x:Bind Labels.TopMode, Mode=OneWay}`,GroupName:`hierachicalGroup`}),_(N,{"x:Name":`nvSample8LeftCompact`,Checked:`panePositionLeftCompact_Checked`,Content:`{x:Bind Labels.LeftCompactMode, Mode=OneWay}`,GroupName:`hierachicalGroup`})]),_:1})]),_:1}),_(F.Substitutions,null,{default:r(()=>[_(t(h),{Key:`PaneDisplay`,Value:`{x:Bind nvSample8.PaneDisplayMode, Mode=OneWay}`})]),_:1}),_(F.Example,null,{default:r(()=>[_(s,{class:`navigationview-sample-layout`},{default:r(()=>[_(s.RowDefinitions,null,{default:r(()=>[_(c,{Height:`Auto`}),_(c,{Height:`Auto`})]),_:1}),_(b,{"Grid.Row":`0`,Margin:`0,0,0,12`,TextWrapping:`WrapWholeWords`}),_(pe,{class:`hierarchy-description`,Margin:`0,0,0,15`,TextWrapping:`Wrap`},{default:r(()=>[_(t(V),null,{default:r(()=>[_(t(H),{Text:`{x:Bind Labels.HierarchyDescription1, Mode=OneWay}`}),_(t(U))]),_:1}),_(t(V),null,{default:r(()=>[_(t(H),{Text:`{x:Bind Labels.HierarchyDescription2, Mode=OneWay}`}),_(t(U))]),_:1}),_(t(V),null,{default:r(()=>[_(t(H),{Text:`{x:Bind Labels.HierarchyDescription3, Mode=OneWay}`}),_(t(U))]),_:1}),_(t(V),null,{default:r(()=>[_(t(H),{Text:`{x:Bind Labels.HierarchyDescription4, Mode=OneWay}`})]),_:1})]),_:1}),_(O,{"x:Name":`nvSample8`,"Grid.Row":`1`,Height:`460`,IsTabStop:`False`,PaneDisplayMode:`Left`,SelectionChanged:`NavigationView_SelectionChanged8`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.Home, Mode=OneWay}`,Icon:`Home`,Tag:`SamplePage1`,"ToolTipService.ToolTip":`{x:Bind Labels.Home, Mode=OneWay}`}),_(t(D),{Content:`{x:Bind Labels.Account, Mode=OneWay}`,Icon:`Contact`,Tag:`SamplePage2`,"ToolTipService.ToolTip":`{x:Bind Labels.Account, Mode=OneWay}`},{default:r(()=>[_(t(D).MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.Mail, Mode=OneWay}`,Icon:`Mail`,Tag:`SamplePage3`,"ToolTipService.ToolTip":`{x:Bind Labels.Mail, Mode=OneWay}`}),_(t(D),{Content:`{x:Bind Labels.Calendar, Mode=OneWay}`,Icon:`Calendar`,Tag:`SamplePage4`,"ToolTipService.ToolTip":`{x:Bind Labels.Calendar, Mode=OneWay}`})]),_:1})]),_:1}),_(t(D),{Content:`{x:Bind Labels.DocumentOptions, Mode=OneWay}`,Icon:`Page2`,SelectsOnInvoked:`False`,"ToolTipService.ToolTip":`{x:Bind Labels.DocumentOptions, Mode=OneWay}`},{default:r(()=>[_(t(D).MenuItems,null,{default:r(()=>[_(t(D),{Content:`{x:Bind Labels.CreateNew, Mode=OneWay}`,Icon:`NewFolder`,Tag:`SamplePage5`,"ToolTipService.ToolTip":`{x:Bind Labels.CreateNew, Mode=OneWay}`}),_(t(D),{Content:`{x:Bind Labels.UploadFile, Mode=OneWay}`,Icon:`OpenLocal`,Tag:`SamplePage6`,"ToolTipService.ToolTip":`{x:Bind Labels.UploadFile, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),_(A,{"x:Name":`contentFrame8`})]),_:1})]),_:1})]),_:1}),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Hierarchy, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(F,{VerticalAlignment:`Top`,HorizontalContentAlignment:`Stretch`,SampleDefinition:`NavigationView\\NavigationViewApiAction.txt`,WebViewHeight:`250`,class:`navigationview-example`,HeaderText:`{x:Bind Labels.ApiHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml.Api, Mode=OneWay}`},{default:r(()=>[_(F.Options,null,{default:r(()=>[_(M,null,{default:r(()=>[_(I,{"x:Name":`settingsCheck`,Click:`settingsCheck_Click`,Content:`{x:Bind Labels.SettingsVisible, Mode=OneWay}`,IsChecked:`True`}),_(I,{"x:Name":`visibleCheck`,Click:`visibleCheck_Click`,Content:`{x:Bind Labels.BackVisible, Mode=OneWay}`,IsChecked:`True`}),_(I,{"x:Name":`enableCheck`,Click:`enableCheck_Click`,Content:`{x:Bind Labels.BackEnabled, Mode=OneWay}`,IsChecked:`False`}),_(I,{"x:Name":`autoSuggestCheck`,Click:`autoSuggestCheck_Click`,Content:`{x:Bind Labels.AutosuggestVisible, Mode=OneWay}`,IsChecked:`True`}),_(b,{Margin:`0,12,0,0`,Text:`{x:Bind Labels.HeaderLabel, Mode=OneWay}`}),_(j,{"x:Name":`headerText`,"AutomationProperties.Name":`{x:Bind Labels.HeaderProperty, Mode=OneWay}`,Text:`{x:Bind Labels.HeaderValue, Mode=OneWay}`}),_(I,{"x:Name":`headerCheck`,Click:`headerCheck_Click`,Content:`{x:Bind Labels.AlwaysShowHeader, Mode=OneWay}`,IsChecked:`True`}),_(b,{Margin:`0,12,0,0`,Text:`{x:Bind Labels.PaneTitleLabel, Mode=OneWay}`}),_(j,{"x:Name":`paneText`,"AutomationProperties.Name":`{x:Bind Labels.PaneTitleProperty, Mode=OneWay}`,Text:`{x:Bind Labels.PaneTitleValue, Mode=OneWay}`}),_(I,{"x:Name":`panemc_Check`,Click:`panemc_Check_Click`,Content:`{x:Bind Labels.PaneCustomVisible, Mode=OneWay}`,IsChecked:`False`}),_(I,{"x:Name":`paneFooterCheck`,Click:`paneFooterCheck_Click`,Content:`{x:Bind Labels.PaneFooterVisible, Mode=OneWay}`,IsChecked:`False`}),_(b,{Margin:`0,12,0,0`,Text:`{x:Bind Labels.PanePositionProperty, Mode=OneWay}`}),_(N,{"x:Name":`nvSampleLeft`,Checked:`panePositionLeft_Checked`,Content:`{x:Bind Labels.Left, Mode=OneWay}`,IsChecked:`True`,GroupName:`apiPanePosition`}),_(N,{"x:Name":`nvSampleTop`,Margin:`0,0,0,12`,Checked:`panePositionTop_Checked`,Content:`{x:Bind Labels.Top, Mode=OneWay}`,GroupName:`apiPanePosition`}),_(I,{"x:Name":`sffCheck`,Click:`sffCheck_Click`,Content:`{x:Bind Labels.KeyboardSelectionFollowsFocus, Mode=OneWay}`,IsChecked:`False`}),_(I,{"x:Name":`suppressselectionCheck_Checked`,Click:`suppressselectionCheck_Checked_Click`,Content:`{x:Bind Labels.SuppressMenuItem2, Mode=OneWay}`,IsChecked:`False`})]),_:1})]),_:1}),_(F.Substitutions,null,{default:r(()=>[_(t(h),{Key:`SettingsVis`,Value:`{x:Bind settingsCheck.IsChecked, Mode=OneWay}`}),_(t(h),{Key:`BackButtonVis`,Value:`{x:Bind nvSample.IsBackButtonVisible, Mode=OneWay}`}),_(t(h),{Key:`BackButtonEn`,Value:`{x:Bind enableCheck.IsChecked, Mode=OneWay}`}),_(t(h),{Key:`HeaderText`,Value:`{x:Bind headerText.Text, Mode=OneWay}`}),_(t(h),{Key:`ShowHeader`,Value:`{x:Bind headerCheck.IsChecked, Mode=OneWay}`}),_(t(h),{Key:`PaneTitleText`,Value:`{x:Bind paneText.Text, Mode=OneWay}`}),_(t(h),{Key:`PaneCustomContentVis`,Value:`{x:Bind paneCustomContentVisibility, Mode=OneWay}`}),_(t(h),{Key:`PaneFooterVis`,Value:`{x:Bind paneFooterVisibility, Mode=OneWay}`}),_(t(h),{Key:`PaneDisplayMode`,Value:`{x:Bind nvSample.PaneDisplayMode, Mode=OneWay}`}),_(t(h),{Key:`SelectionFollowsFocus`,Value:`{x:Bind nvSample.SelectionFollowsFocus, Mode=OneWay}`}),_(t(h),{Key:`SelectsOnInvoked`,Value:`{x:Bind SamplePage2Item.SelectsOnInvoked, Mode=OneWay}`}),_(t(h),{Key:`NavViewASB`,"x:Name":`navViewASB`})]),_:1}),_(F.Example,null,{default:r(()=>[_(O,{"x:Name":`nvSample`,Height:`540`,Margin:`0,12,0,0`,ExpandedModeThresholdWidth:`500`,Header:`{x:Bind headerText.Text, Mode=TwoWay}`,IsTabStop:`False`,PaneDisplayMode:`Left`,PaneTitle:`{x:Bind paneText.Text, Mode=TwoWay}`,SelectionChanged:`NavigationView_SelectionChanged`,class:`navigationview-sample`},{default:r(()=>[_(O.MenuItems,null,{default:r(()=>[_(t(D),{"x:Name":`SamplePage1Item`,Content:`{x:Bind Labels.MenuItem1, Mode=OneWay}`,Tag:`SamplePage1`},{default:r(()=>[_(t(D).Icon,null,{default:r(()=>[_(e,{Symbol:`Play`})]),_:1})]),_:1}),_(t(ce),{Content:`{x:Bind Labels.Actions, Mode=OneWay}`}),_(t(D),{"x:Name":`SamplePage2Item`,Content:`{x:Bind Labels.MenuItem2, Mode=OneWay}`,SelectsOnInvoked:`{x:Bind selectsOnInvoked, Mode=OneWay}`,Tag:`SamplePage2`},{default:r(()=>[_(t(D).Icon,null,{default:r(()=>[_(e,{Symbol:`Save`})]),_:1})]),_:1}),_(t(D),{"x:Name":`SamplePage3Item`,Content:`{x:Bind Labels.MenuItem3, Mode=OneWay}`,Tag:`SamplePage3`},{default:r(()=>[_(t(D).Icon,null,{default:r(()=>[_(e,{Symbol:`Refresh`})]),_:1})]),_:1})]),_:1}),_(O.PaneCustomContent,null,{default:r(()=>[_(ue,{"x:Name":`PaneHyperlink`,Margin:`12,0`,Content:`{x:Bind Labels.MoreInfo, Mode=OneWay}`,Visibility:`{x:Bind paneCustomContentVisibility, Mode=OneWay}`})]),_:1}),_(O.AutoSuggestBox,null,{default:r(()=>[_(le,{"AutomationProperties.Name":`{x:Bind Labels.Search, Mode=OneWay}`,QueryIcon:`Find`})]),_:1}),_(O.PaneFooter,null,{default:r(()=>[_(M,{"x:Name":`FooterStackPanel`,Orientation:`{x:Bind paneFooterOrientation, Mode=OneWay}`,Visibility:`{x:Bind paneFooterVisibility, Mode=OneWay}`},{default:r(()=>[_(t(D),{"AutomationProperties.Name":`{x:Bind Labels.Download, Mode=OneWay}`,Icon:`Download`}),_(t(D),{"AutomationProperties.Name":`{x:Bind Labels.Favorite, Mode=OneWay}`,Icon:`Favorite`})]),_:1})]),_:1}),_(A,{"x:Name":`contentFrame`})]),_:1})]),_:1}),_(F.Output,null,{default:r(()=>[_(b,{class:`navigationview-output`,Text:`{x:Bind Outputs.Api, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),_(Ce.VisualStateGroups,null,{default:r(()=>[_(t(we),null,{default:r(()=>[_(t(q),null,{default:r(()=>[_(t(q).StateTriggers,null,{default:r(()=>[_(t(Te),{MinWindowWidth:`{x:Bind nvSample2.CompactModeThresholdWidth}`})]),_:1}),_(t(q).Setters,null,{default:r(()=>[_(t(Ee),{Target:`nvSample2.PaneDisplayMode`,Value:`Top`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-c87c88c2`]]);export{K as default};