import{Di as e,Ei as t,Gi as n,I as r,Ki as i,Li as a,Wt as o,_i as s,a as c,ai as l,bi as u,cr as d,et as f,o as p,pi as m,si as h,sr as g,t as _,x as v}from"./ScrollViewer-BWDA_C78.js";import{t as y}from"./Button-BNDPNdYJ.js";import{n as b,t as x}from"./BreadcrumbBar-DmIwom8E.js";import{t as S}from"./StackPanel-sg_Bd5oB.js";import{t as C}from"./ToggleButton-HP5wmrvH.js";import{t as w}from"./ControlExample-CzGyf8u0.js";import{t as T}from"./pageState-CcJibQcm.js";var E=`--- header
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
}`,O={__name:`BreadcrumbBarPage`,setup(t,{expose:a}){a();let{t:o}=f(),m=s(`currentPage`),{isFavoriteState:h,pageTheme:O,toggleTheme:k,toggleFavorite:A}=T(m?.value||`breadcrumbbar`),j=i({});e(g,j);let M=l(()=>({Title:o(`text.breadcrumbbar`),Description:o(`text.breadcrumbbar-description`),ToggleTheme:o(`gallery.page-header.toggle-theme`),BasicHeader:o(`sample.breadcrumbbar.control`),CustomHeader:o(`sample.breadcrumbbar.custom-data-template`),ResetSample:o(`sample.breadcrumbbar.reset-sample`)})),N=l(()=>o(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=l(()=>h.value?``:``),F=n(``),I=[`sample.breadcrumbbar.home`,`sample.breadcrumbbar.folder-1`,`sample.breadcrumbbar.folder-2`,`sample.breadcrumbbar.folder-3`],L=I.map(e=>({get Name(){return o(e)}})),R=n([...L]),z=l(()=>[o(`sample.breadcrumbbar.home`),o(`sample.breadcrumbbar.documents`),o(`sample.breadcrumbbar.design`),o(`sample.breadcrumbbar.northwind`),o(`sample.breadcrumbbar.images`),o(`sample.breadcrumbbar.folder-1`),o(`sample.breadcrumbbar.folder-2`),o(`sample.breadcrumbbar.folder-3`)]),B=(e,t)=>{let n=e?.ItemsSource;if(Array.isArray(n))for(let e=n.length-1;e>=t.Index+1;--e)n.splice(e,1)},V=()=>{let e=j.BreadcrumbBar2?.ItemsSource;if(Array.isArray(e)){for(let t of L)e.includes(t)||e.push(t);F.value=``,u(()=>{F.value=o(`sample.breadcrumbbar.reset-success`)})}},H=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,U=H(E,`xaml`),W=H(E,`c#`),G=H(D,`xaml`),K=H(D,`c#`);e(d,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:h,pageTheme:O,toggleTheme:k,toggleFavorite:A,FoldersString:z,Folders:R,ResetAnnouncement:F,BreadcrumbBar2_ItemClicked:B,ResetSampleButton_Click:V,BasicXaml:U,BasicCSharp:W,CustomXaml:G,CustomCSharp:K});let q={t:o,currentPage:m,isFavoriteState:h,pageTheme:O,toggleTheme:k,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,ResetAnnouncement:F,folderKeys:I,_defaultFolders:L,Folders:R,FoldersString:z,BreadcrumbBar2_ItemClicked:B,ResetSampleButton_Click:V,sampleSection:H,BasicXaml:U,BasicCSharp:W,CustomXaml:G,CustomCSharp:K,computed:l,inject:s,nextTick:u,provide:e,ref:n,shallowReactive:i,BreadcrumbBar:x,BreadcrumbBarItem:b,Button:y,get DataTemplate(){return v},ControlExample:w,FontIcon:c,Page:r,ScrollViewer:_,StackPanel:S,TextBlock:p,ToggleButton:C,get useI18n(){return f},get xamlNameScopeKey(){return g},get xamlScopeKey(){return d},get createPageState(){return T},get basicSample(){return E},get customSample(){return D}};return Object.defineProperty(q,"__isScriptSetup",{enumerable:!1,value:!0}),q}};function k(e,n,r,i,o,s){return t(),h(i.Page,null,{default:a(()=>[m(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:a(()=>[m(i.StackPanel,{class:`gallery-item-page`},{default:a(()=>[m(i.StackPanel,{class:`page-heading`},{default:a(()=>[m(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),m(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),m(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:a(()=>[m(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:a(()=>[m(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),m(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:a(()=>[m(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),m(i.StackPanel,{class:`gallery-page-content`},{default:a(()=>[m(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControl.txt`,HeaderText:`{x:Bind Labels.BasicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind BasicXaml}`,CSharp:`{x:Bind BasicCSharp}`},{default:a(()=>[m(i.ControlExample.Example,null,{default:a(()=>[m(i.BreadcrumbBar,{"x:Name":`BreadcrumbBar1`,ItemsSource:`{x:Bind FoldersString}`})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options)]),_:1}),m(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControlCustomDatatemplate.txt`,HeaderText:`{x:Bind Labels.CustomHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CustomXaml}`,CSharp:`{x:Bind CustomCSharp}`},{default:a(()=>[m(i.ControlExample.Example,null,{default:a(()=>[m(i.BreadcrumbBar,{"x:Name":`BreadcrumbBar2`,ItemsSource:`{x:Bind Folders, Mode=OneWay}`,ItemClicked:`BreadcrumbBar2_ItemClicked`},{default:a(()=>[m(i.BreadcrumbBar.ItemTemplate,null,{default:a(()=>[m(i.DataTemplate,{"x:DataType":`l:Folder`},{default:a(()=>[m(i.BreadcrumbBarItem,null,{default:a(()=>[m(i.BreadcrumbBarItem.ContentTemplate,null,{default:a(()=>[m(i.DataTemplate,{"x:DataType":`l:Folder`},{default:a(()=>[m(i.TextBlock,{Text:`{x:Bind Name}`,"AutomationProperties.Name":`{x:Bind Name}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),m(i.ControlExample.Output),m(i.ControlExample.Options,null,{default:a(()=>[m(i.Button,{"x:Name":`ResetSampleBtn`,Click:`ResetSampleButton_Click`,Content:`{x:Bind Labels.ResetSample, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),m(i.TextBlock,{class:`accessibility-announcement`,Text:`{x:Bind ResetAnnouncement, Mode=OneWay}`,"AutomationProperties.LiveSetting":`Polite`,"aria-live":`polite`})]),_:1})]),_:1})]),_:1})}var A=o(O,[[`render`,k],[`__scopeId`,`data-v-8f773ded`],[`__file`,`BreadcrumbBarPage.vue`]]);export{A as default};