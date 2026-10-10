import{Ai as e,Bi as t,Ci as n,Cn as r,Ji as i,Mn as a,Yi as o,a as s,bi as c,ci as l,dr as u,fr as d,gi as f,ki as p,nn as m,o as h,p as g,t as _,ui as v}from"./ScrollViewer-CHNE18MA.js";import{t as y}from"./Button-DO0TiUOq.js";import{n as b,t as x}from"./BreadcrumbBar-CeLnpynG.js";import{t as S}from"./StackPanel-C60XOD66.js";import{t as C}from"./ToggleButton-ZsjZg8Nu.js";import{t as w}from"./ControlExample-BKyw2NwY.js";import{t as T}from"./pageState-Djrh7EdY.js";var E=`--- header
A BreadcrumbBar control
--- xaml
<BreadcrumbBar x:Name="BreadcrumbBar1"/>
--- c#
BreadcrumbBar1.ItemsSource = new string[] { "Home", "Documents", "Design", "Northwind", "Images", "Folder1", "Folder2", "Folder3" };`,D=`--- header
BreadCrumbBar Control with Custom DataTemplate
--- xaml
<BreadcrumbBar x:Name="BreadcrumbBar2">
    <BreadcrumbBar.ItemTemplate>
        <DataTemplate x:DataType="l:Folder">
            <BreadcrumbBarItem Content="{Binding}" AutomationProperties.Name="{Binding Name}">
                <BreadcrumbBarItem.ContentTemplate>
                    <DataTemplate>
                        <TextBlock Text="{Binding Name}" />
                    </DataTemplate>
                </BreadcrumbBarItem.ContentTemplate>
            </BreadcrumbBarItem>
        </DataTemplate>
    </BreadcrumbBar.ItemTemplate>
</BreadcrumbBar>
--- c#
public class Folder
{
    public string Name { get; set; }
}

BreadcrumbBar2.ItemsSource = new ObservableCollection<Folder>{
        new Folder { Name = "Home"},
        new Folder { Name = "Folder1" },
        new Folder { Name = "Folder2" },
        new Folder { Name = "Folder3" },
};
BreadcrumbBar2.ItemClicked += BreadcrumbBar2_ItemClicked;

private void BreadcrumbBar2_ItemClicked(BreadcrumbBar sender, BreadcrumbBarItemClickedEventArgs args)
{
    var items = BreadcrumbBar2.ItemsSource as ObservableCollection<Folder>;
    for (int i = items.Count - 1; i >= args.Index + 1; i--)
    {
        items.RemoveAt(i);
    }
}`,O={__name:`BreadcrumbBarPage`,setup(t,{expose:a}){a();let{t:f}=g(),p=c(`currentPage`),{isFavoriteState:v,pageTheme:O,toggleTheme:k,toggleFavorite:A}=T(p?.value||`breadcrumbbar`),j=o({});e(u,j);let M=l(()=>({Title:f(`text.breadcrumbbar`),Description:f(`text.breadcrumbbar-description`),ToggleTheme:f(`gallery.page-header.toggle-theme`),BasicHeader:f(`sample.breadcrumbbar.control`),CustomHeader:f(`sample.breadcrumbbar.custom-data-template`),ResetSample:f(`sample.breadcrumbbar.reset-sample`)})),N=l(()=>f(v.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=l(()=>v.value?``:``),F=i(``),I=[`sample.breadcrumbbar.home`,`sample.breadcrumbbar.folder-1`,`sample.breadcrumbbar.folder-2`,`sample.breadcrumbbar.folder-3`],L=I.map(e=>({get Name(){return f(e)}})),R=i([...L]),z=l(()=>[f(`sample.breadcrumbbar.home`),f(`sample.breadcrumbbar.documents`),f(`sample.breadcrumbbar.design`),f(`sample.breadcrumbbar.northwind`),f(`sample.breadcrumbbar.images`),f(`sample.breadcrumbbar.folder-1`),f(`sample.breadcrumbbar.folder-2`),f(`sample.breadcrumbbar.folder-3`)]),B=(e,t)=>{let n=e?.ItemsSource;if(Array.isArray(n))for(let e=n.length-1;e>=t.Index+1;--e)n.splice(e,1)},V=()=>{let e=j.BreadcrumbBar2?.ItemsSource;if(Array.isArray(e)){for(let t of L)e.includes(t)||e.push(t);F.value=``,n(()=>{F.value=f(`sample.breadcrumbbar.reset-success`)})}},H=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,U=H(E,`xaml`),W=H(E,`c#`),G=H(D,`xaml`),K=H(D,`c#`);e(d,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:v,pageTheme:O,toggleTheme:k,toggleFavorite:A,FoldersString:z,Folders:R,ResetAnnouncement:F,BreadcrumbBar2_ItemClicked:B,ResetSampleButton_Click:V,BasicXaml:U,BasicCSharp:W,CustomXaml:G,CustomCSharp:K});let q={t:f,currentPage:p,isFavoriteState:v,pageTheme:O,toggleTheme:k,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,ResetAnnouncement:F,folderKeys:I,_defaultFolders:L,Folders:R,FoldersString:z,BreadcrumbBar2_ItemClicked:B,ResetSampleButton_Click:V,sampleSection:H,BasicXaml:U,BasicCSharp:W,CustomXaml:G,CustomCSharp:K,computed:l,inject:c,nextTick:n,provide:e,ref:i,shallowReactive:o,BreadcrumbBar:x,BreadcrumbBarItem:b,Button:y,get DataTemplate(){return m},ControlExample:w,FontIcon:s,Page:r,ScrollViewer:_,StackPanel:S,TextBlock:h,ToggleButton:C,get useI18n(){return g},get xamlNameScopeKey(){return u},get xamlScopeKey(){return d},get createPageState(){return T},get basicSample(){return E},get customSample(){return D}};return Object.defineProperty(q,"__isScriptSetup",{enumerable:!1,value:!0}),q}};function k(e,n,r,i,a,o){return p(),v(i.Page,null,{default:t(()=>[f(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[f(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[f(i.StackPanel,{class:`page-heading`},{default:t(()=>[f(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),f(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:t(()=>[f(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),f(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),f(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[f(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControl.txt`,HeaderText:`{x:Bind Labels.BasicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind BasicXaml}`,CSharp:`{x:Bind BasicCSharp}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.BreadcrumbBar,{"x:Name":`BreadcrumbBar1`,ItemsSource:`{x:Bind FoldersString}`})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options)]),_:1}),f(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControlCustomDatatemplate.txt`,HeaderText:`{x:Bind Labels.CustomHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CustomXaml}`,CSharp:`{x:Bind CustomCSharp}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.BreadcrumbBar,{"x:Name":`BreadcrumbBar2`,ItemsSource:`{x:Bind Folders, Mode=OneWay}`,ItemClicked:`BreadcrumbBar2_ItemClicked`},{default:t(()=>[f(i.BreadcrumbBar.ItemTemplate,null,{default:t(()=>[f(i.DataTemplate,{"x:DataType":`l:Folder`},{default:t(()=>[f(i.BreadcrumbBarItem,null,{default:t(()=>[f(i.BreadcrumbBarItem.ContentTemplate,null,{default:t(()=>[f(i.DataTemplate,{"x:DataType":`l:Folder`},{default:t(()=>[f(i.TextBlock,{Text:`{x:Bind Name}`,"AutomationProperties.Name":`{x:Bind Name}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output),f(i.ControlExample.Options,null,{default:t(()=>[f(i.Button,{"x:Name":`ResetSampleBtn`,Click:`ResetSampleButton_Click`,Content:`{x:Bind Labels.ResetSample, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),f(i.TextBlock,{class:`accessibility-announcement`,Text:`{x:Bind ResetAnnouncement, Mode=OneWay}`,"AutomationProperties.LiveSetting":`Polite`,"aria-live":`polite`})]),_:1})]),_:1})]),_:1})}var A=a(O,[[`render`,k],[`__scopeId`,`data-v-8f773ded`],[`__file`,`BreadcrumbBarPage.vue`]]);export{A as default};