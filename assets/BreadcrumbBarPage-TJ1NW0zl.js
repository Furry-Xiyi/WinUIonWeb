import{Fi as e,I as t,Ti as n,Ui as r,Wi as i,Wt as a,a as o,ai as s,di as c,et as l,hi as u,o as d,or as f,ri as p,sr as m,t as h,vi as g,wi as _,x as v}from"./ScrollViewer-PoO_ma9Z.js";import{t as y}from"./Button-DjU0urmJ.js";import{n as b,t as x}from"./BreadcrumbBar-2H4Jg_L1.js";import{t as S}from"./StackPanel-CT7pl8zy.js";import{t as C}from"./ToggleButton-DwmhXZge.js";import{t as w}from"./ControlExample-C1ahTZEr.js";import{t as T}from"./pageState-BN3kXI7L.js";var E=`--- header
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
}`,O={__name:`BreadcrumbBarPage`,setup(e,{expose:a}){a();let{t:s}=l(),c=u(`currentPage`),{isFavoriteState:_,pageTheme:O,toggleTheme:k,toggleFavorite:A}=T(c?.value||`breadcrumbbar`),j=i({});n(f,j);let M=p(()=>({Title:s(`text.breadcrumbbar`),Description:s(`text.breadcrumbbar-description`),ToggleTheme:s(`gallery.page-header.toggle-theme`),BasicHeader:s(`sample.breadcrumbbar.control`),CustomHeader:s(`sample.breadcrumbbar.custom-data-template`),ResetSample:s(`sample.breadcrumbbar.reset-sample`)})),N=p(()=>s(_.value?`gallery.remove-favorite`:`gallery.add-favorite`)),P=p(()=>_.value?``:``),F=r(``),I=[`sample.breadcrumbbar.home`,`sample.breadcrumbbar.folder-1`,`sample.breadcrumbbar.folder-2`,`sample.breadcrumbbar.folder-3`],L=I.map(e=>({get Name(){return s(e)}})),R=r([...L]),z=p(()=>[s(`sample.breadcrumbbar.home`),s(`sample.breadcrumbbar.documents`),s(`sample.breadcrumbbar.design`),s(`sample.breadcrumbbar.northwind`),s(`sample.breadcrumbbar.images`),s(`sample.breadcrumbbar.folder-1`),s(`sample.breadcrumbbar.folder-2`),s(`sample.breadcrumbbar.folder-3`)]),B=(e,t)=>{let n=e?.ItemsSource;if(Array.isArray(n))for(let e=n.length-1;e>=t.Index+1;--e)n.splice(e,1)},V=()=>{let e=j.BreadcrumbBar2?.ItemsSource;if(Array.isArray(e)){for(let t of L)e.includes(t)||e.push(t);F.value=``,g(()=>{F.value=s(`sample.breadcrumbbar.reset-success`)})}},H=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``,U=H(E,`xaml`),W=H(E,`c#`),G=H(D,`xaml`),K=H(D,`c#`);n(m,{Labels:M,FavoriteLabel:N,FavoriteGlyph:P,isFavoriteState:_,pageTheme:O,toggleTheme:k,toggleFavorite:A,FoldersString:z,Folders:R,ResetAnnouncement:F,BreadcrumbBar2_ItemClicked:B,ResetSampleButton_Click:V,BasicXaml:U,BasicCSharp:W,CustomXaml:G,CustomCSharp:K});let q={t:s,currentPage:c,isFavoriteState:_,pageTheme:O,toggleTheme:k,toggleFavorite:A,Names:j,Labels:M,FavoriteLabel:N,FavoriteGlyph:P,ResetAnnouncement:F,folderKeys:I,_defaultFolders:L,Folders:R,FoldersString:z,BreadcrumbBar2_ItemClicked:B,ResetSampleButton_Click:V,sampleSection:H,BasicXaml:U,BasicCSharp:W,CustomXaml:G,CustomCSharp:K,computed:p,inject:u,nextTick:g,provide:n,ref:r,shallowReactive:i,BreadcrumbBar:x,BreadcrumbBarItem:b,Button:y,get DataTemplate(){return v},ControlExample:w,FontIcon:o,Page:t,ScrollViewer:h,StackPanel:S,TextBlock:d,ToggleButton:C,get useI18n(){return l},get xamlNameScopeKey(){return f},get xamlScopeKey(){return m},get createPageState(){return T},get basicSample(){return E},get customSample(){return D}};return Object.defineProperty(q,"__isScriptSetup",{enumerable:!1,value:!0}),q}};function k(t,n,r,i,a,o){return _(),s(i.Page,null,{default:e(()=>[c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[c(i.StackPanel,{class:`page-heading`},{default:e(()=>[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:e(()=>[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),c(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(i.ControlExample,{"x:Name":`Example1`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControl.txt`,HeaderText:`{x:Bind Labels.BasicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind BasicXaml}`,CSharp:`{x:Bind BasicCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.BreadcrumbBar,{"x:Name":`BreadcrumbBar1`,ItemsSource:`{x:Bind FoldersString}`})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options)]),_:1}),c(i.ControlExample,{"x:Name":`Example2`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControlCustomDatatemplate.txt`,HeaderText:`{x:Bind Labels.CustomHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CustomXaml}`,CSharp:`{x:Bind CustomCSharp}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.BreadcrumbBar,{"x:Name":`BreadcrumbBar2`,ItemsSource:`{x:Bind Folders, Mode=OneWay}`,ItemClicked:`BreadcrumbBar2_ItemClicked`},{default:e(()=>[c(i.BreadcrumbBar.ItemTemplate,null,{default:e(()=>[c(i.DataTemplate,{"x:DataType":`l:Folder`},{default:e(()=>[c(i.BreadcrumbBarItem,null,{default:e(()=>[c(i.BreadcrumbBarItem.ContentTemplate,null,{default:e(()=>[c(i.DataTemplate,{"x:DataType":`l:Folder`},{default:e(()=>[c(i.TextBlock,{Text:`{x:Bind Name}`,"AutomationProperties.Name":`{x:Bind Name}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output),c(i.ControlExample.Options,null,{default:e(()=>[c(i.Button,{"x:Name":`ResetSampleBtn`,Click:`ResetSampleButton_Click`,Content:`{x:Bind Labels.ResetSample, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.TextBlock,{class:`accessibility-announcement`,Text:`{x:Bind ResetAnnouncement, Mode=OneWay}`,"AutomationProperties.LiveSetting":`Polite`,"aria-live":`polite`})]),_:1})]),_:1})]),_:1})}var A=a(O,[[`render`,k],[`__scopeId`,`data-v-8f773ded`],[`__file`,`BreadcrumbBarPage.vue`]]);export{A as default};