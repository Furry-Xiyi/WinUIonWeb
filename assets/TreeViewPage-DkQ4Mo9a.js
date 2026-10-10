import{Fi as e,I as t,Lt as n,Oi as r,S as i,Wt as a,a as o,ai as s,di as c,et as l,fi as u,hi as d,o as f,ri as p,t as m,wi as h}from"./ScrollViewer-PoO_ma9Z.js";import{t as g}from"./Button-DjU0urmJ.js";import{t as _}from"./Image-Bse8ORbC.js";import{t as v}from"./StackPanel-CT7pl8zy.js";import{t as y}from"./ToggleButton-DwmhXZge.js";import{t as b}from"./TreeView-B5R-pqZR.js";import{t as x}from"./ControlExample-C1ahTZEr.js";import{t as S}from"./pageState-BN3kXI7L.js";var C=`--- header
A TreeView with DataBinding Using ItemSource
--- xaml
<TreeView ItemsSource="{x:Bind DataSource}">
   <TreeView.ItemTemplate>
      <DataTemplate x:DataType="local:ExplorerItem">
         <TreeViewItem ItemsSource="{x:Bind Children}" Content="{x:Bind Name}"/>
      </DataTemplate>
   </TreeView.ItemTemplate>
</TreeView>
--- c#
using System.Collections.ObjectModel;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace YourNamespace
{
    public sealed partial class YourPage : Page
    {
        // DataSource is the data collection that will be bound to the TreeView's ItemsSource.
        public ObservableCollection<ExplorerItem> DataSource { get; set; }

        public YourPage()
        {
            this.InitializeComponent();

            // Initialize the data source with sample data and set it as the context for data binding.
            DataSource = GetData();
            this.DataContext = this; // Bind the DataContext of the page to itself for XAML bindings.
        }

        // Method to provide sample data for the TreeView.
        private ObservableCollection<ExplorerItem> GetData()
        {
            return new ObservableCollection<ExplorerItem>
            {
                // Root folder with child files.
                new ExplorerItem
                {
                    Name = "Documents",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "ProjectProposal",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                        new ExplorerItem
                        {
                            Name = "BudgetReport",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
                // Another root folder with one child file.
                new ExplorerItem
                {
                    Name = "Projects",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "Project Plan",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
            };
        }
    }

    // Class to represent items in the TreeView.
    public class ExplorerItem
    {
        // Enum to define the type of the item: Folder or File.
        public enum ExplorerItemType
        {
            Folder,
            File,
        }

        // Name of the item (displayed in the TreeView).
        public string Name { get; set; } = string.Empty;

        // Type of the item (Folder or File).
        public ExplorerItemType Type { get; set; }

        // Collection of child items. Used for nested nodes in the TreeView.
        public ObservableCollection<ExplorerItem> Children { get; set; } = new ObservableCollection<ExplorerItem>();
    }
}
`,w=`--- header
A simple TreeView with drag and drop support
--- xaml
<TreeView x:Name="sampleTreeView" CanDragItems="True"  AllowDrop="True"/>
--- c#
private void InitializeSampleTreeView(TreeView sampleTreeView)
{
    // Create a root node with initial content and set it to be expanded.
    TreeViewNode workNode = new TreeViewNode() { Content = "Work Documents" };
    workNode.IsExpanded = true;

    // Add child nodes with content related to the root node.
    workNode.Children.Add(new TreeViewNode() { Content = "XYZ Functional Spec" });
    workNode.Children.Add(new TreeViewNode() { Content = "Feature Schedule" });

    // Create another node with initial content and set it to be expanded.
    TreeViewNode remodelNode = new TreeViewNode() { Content = "Home Remodel" };
    remodelNode.IsExpanded = true;

    // Add child nodes with specific content under this node.
    remodelNode.Children.Add(new TreeViewNode() { Content = "Contractor Contact Info" });
    remodelNode.Children.Add(new TreeViewNode() { Content = "Paint Color Scheme" });

    // Create a node with broader content that includes the previous node as a child.
    TreeViewNode personalNode = new TreeViewNode() { Content = "Personal Documents" };
    personalNode.IsExpanded = true;
    personalNode.Children.Add(remodelNode);

    // Add the main nodes to the TreeView's root.
    sampleTreeView.RootNodes.Add(workNode);
    sampleTreeView.RootNodes.Add(personalNode);
}
`,T=`--- header
A TreeView with Multi-selection enabled
--- xaml
<TreeView x:Name="sampleTreeView" SelectionMode="Multiple" />
--- c#
private void InitializeSampleTreeView(TreeView sampleTreeView)
{
    // Create a root node with initial content and set it to be expanded.
    TreeViewNode workNode = new TreeViewNode() { Content = "Work Documents" };
    workNode.IsExpanded = true;

    // Add child nodes with content related to the root node.
    workNode.Children.Add(new TreeViewNode() { Content = "XYZ Functional Spec" });
    workNode.Children.Add(new TreeViewNode() { Content = "Feature Schedule" });

    // Create another node with initial content and set it to be expanded.
    TreeViewNode remodelNode = new TreeViewNode() { Content = "Home Remodel" };
    remodelNode.IsExpanded = true;

    // Add child nodes with specific content under this node.
    remodelNode.Children.Add(new TreeViewNode() { Content = "Contractor Contact Info" });
    remodelNode.Children.Add(new TreeViewNode() { Content = "Paint Color Scheme" });

    // Create a node with broader content that includes the previous node as a child.
    TreeViewNode personalNode = new TreeViewNode() { Content = "Personal Documents" };
    personalNode.IsExpanded = true;
    personalNode.Children.Add(remodelNode);

    // Add the main nodes to the TreeView's root.
    sampleTreeView.RootNodes.Add(workNode);
    sampleTreeView.RootNodes.Add(personalNode);
}
`,E=`--- header
A TreeView with ItemTemplateSelector
--- xaml
<Page ...
      xmlns:local="using:YourNamespace" >

    <Page.Resources>
        <!-- DataTemplate for folders -->
        <DataTemplate x:Key="FolderTemplate" x:DataType="local:ExplorerItem">
            <TreeViewItem AutomationProperties.Name="{x:Bind Name}"
                ItemsSource="{x:Bind Children}" IsExpanded="True">
                <StackPanel Orientation="Horizontal">
                    <Image Width="20" Source="../Assets/SampleMedia/folder.png"/>
                    <TextBlock Margin="0,0,10,0"/>
                    <TextBlock Text="{x:Bind Name}" />
                </StackPanel>
            </TreeViewItem>
        </DataTemplate>

        <!-- DataTemplate for files -->
        <DataTemplate x:Key="FileTemplate" x:DataType="local:ExplorerItem">
            <TreeViewItem AutomationProperties.Name="{x:Bind Name}">
                <StackPanel Orientation="Horizontal">
                    <FontIcon Glyph="&#xE8A5;" />
                    <TextBlock Margin="0,0,10,0"/>
                    <TextBlock Text="{x:Bind Name}"/>
                </StackPanel>
            </TreeViewItem>
        </DataTemplate>

        <!-- Template selector for ExplorerItem types -->
        <local:ExplorerItemTemplateSelector x:Key="ExplorerItemTemplateSelector"
            FolderTemplate="{StaticResource FolderTemplate}"
            FileTemplate="{StaticResource FileTemplate}" />
    </Page.Resources>

    <!-- TreeView bound to DataSource, using the ItemTemplateSelector -->
    <TreeView ItemsSource="{x:Bind DataSource}"
              ItemTemplateSelector="{StaticResource ExplorerItemTemplateSelector}" />
</Page>
--- c#
using System.Collections.ObjectModel;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace YourNamespace
{
    public sealed partial class YourPage : Page
    {
        public ObservableCollection<ExplorerItem> DataSource { get; set; }

        public YourPage()
        {
            this.InitializeComponent();
            DataSource = GetData();
            this.DataContext = this;
        }

        private ObservableCollection<ExplorerItem> GetData()
        {
            return new ObservableCollection<ExplorerItem>
            {
                new ExplorerItem
                {
                    Name = "Documents",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "ProjectProposal",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                        new ExplorerItem
                        {
                            Name = "BudgetReport",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
                new ExplorerItem
                {
                    Name = "Projects",
                    Type = ExplorerItem.ExplorerItemType.Folder,
                    Children =
                    {
                        new ExplorerItem
                        {
                            Name = "Project Plan",
                            Type = ExplorerItem.ExplorerItemType.File,
                        },
                    },
                },
            };
        }
    }

    public class ExplorerItem
    {
        public enum ExplorerItemType
        {
            Folder,
            File,
        }

        public string Name { get; set; } = string.Empty;
        public ExplorerItemType Type { get; set; }
        public ObservableCollection<ExplorerItem> Children { get; set; } = new ObservableCollection<ExplorerItem>();
    }

    class ExplorerItemTemplateSelector : DataTemplateSelector
    {
        // Template to use for folder items in the TreeView.
        public DataTemplate? FolderTemplate { get; set; }

        // Template to use for file items in the TreeView.
        public DataTemplate? FileTemplate { get; set; }

        // Determines which template to use for each item in the TreeView based on its type.
        protected override DataTemplate? SelectTemplateCore(object item)
        {
            // Cast the item to the ExplorerItem type.
            var explorerItem = (ExplorerItem)item;

            // Return the appropriate template: FolderTemplate for folders, FileTemplate for files.
            return explorerItem.Type == ExplorerItem.ExplorerItemType.Folder
                ? FolderTemplate
                : FileTemplate;
        }
    }
}
`,D=u({__name:`TreeViewPage`,setup(e,{expose:r}){r();let a=e=>{let t={},n=``;for(let r of e.split(/\r?\n/)){let e=r.match(/^---\s+(.+?)\s*$/);e?(n=e[1].toLowerCase(),t[n]=[]):n&&t[n].push(r)}return{header:(t.header??[]).join(`
`).trim(),xaml:(t.xaml??[]).join(`
`).trim(),cSharp:(t[`c#`]??[]).join(`
`).trim()}},s=a(w),c=a(T),u=a(C),h=a(E),{t:D}=l(),O=D(`text.treeview`),k=D(`text.the-treeview-control-is-a-hierarchical-list-patt`),A=D(`sample.treeview.drag-drop`),j=D(`sample.treeview.multi-selection`),M=D(`sample.treeview.databinding-itemsource`),N=D(`sample.treeview.item-template-selector`),P=D(`sample.treeview.toggle-theme`),F=d(`currentPage`),I=p(()=>F?.value||`treeview`),{isFavoriteState:L,pageTheme:R,toggleTheme:z,toggleFavorite:B}=S(I.value),V=p(()=>L.value?``:``),H=p(()=>D(L.value?`sample.treeview.remove-from-favorites`:`sample.treeview.add-to-favorites`)),U=p(()=>({WorkDocuments:D(`sample.treeview.node.work-documents`),XyzFunctionalSpec:D(`sample.treeview.node.xyz-functional-spec`),FeatureSchedule:D(`sample.treeview.node.feature-schedule`),PersonalDocuments:D(`sample.treeview.node.personal-documents`),HomeRemodel:D(`sample.treeview.node.home-remodel`),ContractorContactInfo:D(`sample.treeview.node.contractor-contact-info`),PaintColorScheme:D(`sample.treeview.node.paint-color-scheme`),Documents:D(`sample.treeview.node.documents`),ProjectProposal:D(`sample.treeview.node.project-proposal`),BudgetReport:D(`sample.treeview.node.budget-report`),Projects:D(`sample.treeview.node.projects`),ProjectPlan:D(`sample.treeview.node.project-plan`)})),W={parseSampleDefinition:a,dragDropSample:s,multiSelectionSample:c,dataBindingSample:u,templateSelectorSample:h,t:D,pageTitle:O,pageDescription:k,dragDropHeader:A,multiSelectionHeader:j,dataBindingHeader:M,templateSelectorHeader:N,themeButtonAutomationName:P,currentPage:F,pageKey:I,isFavoriteState:L,pageTheme:R,toggleTheme:z,toggleFavorite:B,favoriteGlyph:V,favoriteButtonAutomationName:H,TreeText:U,DataSource:p(()=>[{Name:U.value.Documents,Type:`Folder`,Children:[{Name:U.value.ProjectProposal,Type:`File`,Children:[]},{Name:U.value.BudgetReport,Type:`File`,Children:[]}]},{Name:U.value.Projects,Type:`Folder`,Children:[{Name:U.value.ProjectPlan,Type:`File`,Children:[]}]}]),Button:g,get ExplorerItemTemplateSelector(){return i},ControlExample:x,FontIcon:o,Grid:n,Image:_,Page:t,ScrollViewer:m,StackPanel:v,TextBlock:f,ToggleButton:y,TreeView:b};return Object.defineProperty(W,"__isScriptSetup",{enumerable:!1,value:!0}),W}});function O(t,n,i,a,o,l){let u=r(`TreeViewItem`),d=r(`DataTemplate`),f=r(`TreeViewNode`),p=r(`TreeViewNode.Children`);return h(),s(a.Page,null,{default:e(()=>[c(a.Page.Resources,null,{default:e(()=>[c(d,{"x:Key":`FolderTemplate`,"x:DataType":`controlpages:ExplorerItem`},{default:e(()=>[c(u,{"AutomationProperties.Name":`{x:Bind Name}`,IsExpanded:`True`,ItemsSource:`{x:Bind Children}`},{default:e(()=>[c(a.StackPanel,{Orientation:`Horizontal`},{default:e(()=>[c(a.Image,{Width:`20`,Source:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/folder.png`}),c(a.TextBlock,{Margin:`0,0,10,0`}),c(a.TextBlock,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),c(d,{"x:Key":`FileTemplate`,"x:DataType":`controlpages:ExplorerItem`},{default:e(()=>[c(u,{"AutomationProperties.Name":`{x:Bind Name}`},{default:e(()=>[c(a.StackPanel,{Orientation:`Horizontal`},{default:e(()=>[c(a.FontIcon,{Glyph:``}),c(a.TextBlock,{Margin:`0,0,10,0`}),c(a.TextBlock,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),c(a.ExplorerItemTemplateSelector,{"x:Key":`ExplorerItemTemplateSelector`,FileTemplate:`{StaticResource FileTemplate}`,FolderTemplate:`{StaticResource FolderTemplate}`})]),_:1}),c(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(a.StackPanel,{class:`gallery-item-page`},{default:e(()=>[c(a.StackPanel,{class:`page-heading`},{default:e(()=>[c(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),c(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[c(a.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonAutomationName, Mode=OneWay}`,Click:`toggleTheme`},{default:e(()=>[c(a.TextBlock,{class:`icon`,Text:``})]),_:1}),c(a.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonAutomationName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:e(()=>[c(a.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(a.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(a.ControlExample,{SampleDefinition:`TreeView\\SimpleTreeviewDragDrop.txt`,HeaderText:`{x:Bind dragDropHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dragDropSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind dragDropSample.cSharp, Mode=OneWay}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.Grid,{Height:`280`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:e(()=>[c(a.TreeView,{"x:Name":`sampleTreeView`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,AllowDrop:`True`,CanDragItems:`True`},{default:e(()=>[c(a.TreeView.RootNodes,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.WorkDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:e(()=>[c(p,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.XyzFunctionalSpec, Mode=OneWay}`}),c(f,{Content:`{x:Bind TreeText.FeatureSchedule, Mode=OneWay}`})]),_:1})]),_:1}),c(f,{Content:`{x:Bind TreeText.PersonalDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:e(()=>[c(p,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.HomeRemodel, Mode=OneWay}`,IsExpanded:`True`},{default:e(()=>[c(p,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.ContractorContactInfo, Mode=OneWay}`}),c(f,{Content:`{x:Bind TreeText.PaintColorScheme, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options)]),_:1}),c(a.ControlExample,{SampleDefinition:`TreeView\\TreeviewMultiSelectionEnabled.txt`,HeaderText:`{x:Bind multiSelectionHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind multiSelectionSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind multiSelectionSample.cSharp, Mode=OneWay}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.Grid,{Height:`280`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:e(()=>[c(a.TreeView,{"x:Name":`sampleTreeView2`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,SelectionMode:`Multiple`},{default:e(()=>[c(a.TreeView.RootNodes,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.WorkDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:e(()=>[c(p,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.XyzFunctionalSpec, Mode=OneWay}`}),c(f,{Content:`{x:Bind TreeText.FeatureSchedule, Mode=OneWay}`})]),_:1})]),_:1}),c(f,{Content:`{x:Bind TreeText.PersonalDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:e(()=>[c(p,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.HomeRemodel, Mode=OneWay}`,IsExpanded:`True`},{default:e(()=>[c(p,null,{default:e(()=>[c(f,{Content:`{x:Bind TreeText.ContractorContactInfo, Mode=OneWay}`}),c(f,{Content:`{x:Bind TreeText.PaintColorScheme, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options)]),_:1}),c(a.ControlExample,{SampleDefinition:`TreeView\\TreeviewDatabindingItemsource.txt`,HeaderText:`{x:Bind dataBindingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dataBindingSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind dataBindingSample.cSharp, Mode=OneWay}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.Grid,{Height:`200`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:e(()=>[c(a.TreeView,{"x:Name":`TreeView1`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,ItemsSource:`{x:Bind DataSource}`},{default:e(()=>[c(a.TreeView.ItemTemplate,null,{default:e(()=>[c(d,{"x:DataType":`controlpages:ExplorerItem`},{default:e(()=>[c(u,{Content:`{x:Bind Name}`,IsExpanded:`True`,ItemsSource:`{x:Bind Children}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options)]),_:1}),c(a.ControlExample,{SampleDefinition:`TreeView\\TreeviewItemtemplateselector.txt`,HeaderText:`{x:Bind templateSelectorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind templateSelectorSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind templateSelectorSample.cSharp, Mode=OneWay}`},{default:e(()=>[c(a.ControlExample.Example,null,{default:e(()=>[c(a.Grid,{Height:`200`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:e(()=>[c(a.TreeView,{"x:Name":`FileTree`,"Grid.Column":`2`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,ItemTemplateSelector:`{StaticResource ExplorerItemTemplateSelector}`,ItemsSource:`{x:Bind DataSource}`})]),_:1})]),_:1}),c(a.ControlExample.Output),c(a.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var k=a(D,[[`render`,O],[`__scopeId`,`data-v-369d03da`],[`__file`,`TreeViewPage.vue`]]);export{k as default};