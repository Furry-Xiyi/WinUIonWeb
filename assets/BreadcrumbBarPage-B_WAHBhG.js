import{$i as e,Ai as t,Bi as n,Ci as r,Cn as i,Ji as a,Mn as o,Yi as s,a as c,bi as l,ci as u,dr as d,fr as f,gi as p,ki as m,nn as h,o as g,p as _,t as v,ui as y}from"./ScrollViewer-B43ymvAj.js";import{t as b}from"./Button-B49t7g4C.js";import{n as x,t as S}from"./BreadcrumbBar-Ba8FQH8Y.js";import{t as C}from"./StackPanel-Dy6dKYi5.js";import{t as w}from"./ToggleButton-DDZy2gVz.js";import{t as T}from"./ControlExample-Ddvmn5_c.js";import{t as E}from"./pageState-BQHW0me4.js";var D=`--- header
A BreadcrumbBar control
--- xaml
<BreadcrumbBar x:Name="BreadcrumbBar1"/>
--- c#
BreadcrumbBar1.ItemsSource = new string[] { "Home", "Documents", "Design", "Northwind", "Images", "Folder1", "Folder2", "Folder3" };`,O=`--- header
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
}`,k=o({__name:`BreadcrumbBarPage`,setup(o){let{t:k}=_(),{isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N}=E(l(`currentPage`)?.value||`breadcrumbbar`),P=s({});t(d,P);let F=u(()=>({Title:k(`text.breadcrumbbar`),Description:k(`text.breadcrumbbar-description`),ToggleTheme:k(`gallery.page-header.toggle-theme`),BasicHeader:k(`sample.breadcrumbbar.control`),CustomHeader:k(`sample.breadcrumbbar.custom-data-template`),ResetSample:k(`sample.breadcrumbbar.reset-sample`)})),I=u(()=>k(A.value?`gallery.remove-favorite`:`gallery.add-favorite`)),L=u(()=>A.value?``:``),R=a(``),z=[`sample.breadcrumbbar.home`,`sample.breadcrumbbar.folder-1`,`sample.breadcrumbbar.folder-2`,`sample.breadcrumbbar.folder-3`].map(e=>({get Name(){return k(e)}})),B=a([...z]),V=u(()=>[k(`sample.breadcrumbbar.home`),k(`sample.breadcrumbbar.documents`),k(`sample.breadcrumbbar.design`),k(`sample.breadcrumbbar.northwind`),k(`sample.breadcrumbbar.images`),k(`sample.breadcrumbbar.folder-1`),k(`sample.breadcrumbbar.folder-2`),k(`sample.breadcrumbbar.folder-3`)]),H=(e,t)=>{let n=e?.ItemsSource;if(Array.isArray(n))for(let e=n.length-1;e>=t.Index+1;--e)n.splice(e,1)},U=()=>{let e=P.BreadcrumbBar2?.ItemsSource;if(Array.isArray(e)){for(let t of z)e.includes(t)||e.push(t);R.value=``,r(()=>{R.value=k(`sample.breadcrumbbar.reset-success`)})}},W=(e,t)=>e.split(/^--- /m).find(e=>e.startsWith(`${t}\n`)||e.startsWith(`${t}\r\n`))?.slice(t.length).trim()??``;return t(f,{Labels:F,FavoriteLabel:I,FavoriteGlyph:L,isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N,FoldersString:V,Folders:B,ResetAnnouncement:R,BreadcrumbBar2_ItemClicked:H,ResetSampleButton_Click:U,BasicXaml:W(D,`xaml`),BasicCSharp:W(D,`c#`),CustomXaml:W(O,`xaml`),CustomCSharp:W(O,`c#`)}),(t,r)=>(m(),y(i,null,{default:n(()=>[p(v,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[p(C,{class:`gallery-item-page`},{default:n(()=>[p(C,{class:`page-heading`},{default:n(()=>[p(g,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),p(g,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(C,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[p(b,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[p(c,{Glyph:``,FontSize:`16`})]),_:1}),p(w,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[p(c,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),p(C,{class:`gallery-page-content`},{default:n(()=>[p(T,{"x:Name":`Example1`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControl.txt`,HeaderText:`{x:Bind Labels.BasicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind BasicXaml}`,CSharp:`{x:Bind BasicCSharp}`},{default:n(()=>[p(T.Example,null,{default:n(()=>[p(S,{"x:Name":`BreadcrumbBar1`,ItemsSource:`{x:Bind FoldersString}`})]),_:1}),p(T.Output),p(T.Options)]),_:1}),p(T,{"x:Name":`Example2`,SampleDefinition:`BreadcrumbBar\\BreadcrumbbarControlCustomDatatemplate.txt`,HeaderText:`{x:Bind Labels.CustomHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind CustomXaml}`,CSharp:`{x:Bind CustomCSharp}`},{default:n(()=>[p(T.Example,null,{default:n(()=>[p(S,{"x:Name":`BreadcrumbBar2`,ItemsSource:`{x:Bind Folders, Mode=OneWay}`,ItemClicked:`BreadcrumbBar2_ItemClicked`},{default:n(()=>[p(S.ItemTemplate,null,{default:n(()=>[p(e(h),{"x:DataType":`l:Folder`},{default:n(()=>[p(x,null,{default:n(()=>[p(x.ContentTemplate,null,{default:n(()=>[p(e(h),{"x:DataType":`l:Folder`},{default:n(()=>[p(g,{Text:`{x:Bind Name}`,"AutomationProperties.Name":`{x:Bind Name}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output),p(T.Options,null,{default:n(()=>[p(b,{"x:Name":`ResetSampleBtn`,Click:`ResetSampleButton_Click`,Content:`{x:Bind Labels.ResetSample, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(g,{class:`accessibility-announcement`,Text:`{x:Bind ResetAnnouncement, Mode=OneWay}`,"AutomationProperties.LiveSetting":`Polite`,"aria-live":`polite`})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-8f773ded`]]);export{k as default};