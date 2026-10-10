import{$i as e,Bi as t,Cn as n,En as r,Mn as i,Ni as a,_i as o,a as s,bi as c,ci as l,gi as u,ki as d,o as f,p,rn as m,t as h,ui as g}from"./ScrollViewer-B43ymvAj.js";import{t as _}from"./Button-B49t7g4C.js";import{t as v}from"./Image-DEHWrAx2.js";import{t as y}from"./StackPanel-Dy6dKYi5.js";import{t as b}from"./ToggleButton-DDZy2gVz.js";import{t as x}from"./ControlExample-Ddvmn5_c.js";import{t as S}from"./TreeView-DwrQQkvl.js";import{t as C}from"./pageState-BQHW0me4.js";var w=`--- header
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
`,T=`--- header
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
`,E=`--- header
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
`,D=`--- header
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
`,O=i(o({__name:`TreeViewPage`,setup(i){let o=e=>{let t={},n=``;for(let r of e.split(/\r?\n/)){let e=r.match(/^---\s+(.+?)\s*$/);e?(n=e[1].toLowerCase(),t[n]=[]):n&&t[n].push(r)}return{header:(t.header??[]).join(`
`).trim(),xaml:(t.xaml??[]).join(`
`).trim(),cSharp:(t[`c#`]??[]).join(`
`).trim()}};o(T),o(E),o(w),o(D);let{t:O}=p();O(`text.treeview`),O(`text.the-treeview-control-is-a-hierarchical-list-patt`),O(`sample.treeview.drag-drop`),O(`sample.treeview.multi-selection`),O(`sample.treeview.databinding-itemsource`),O(`sample.treeview.item-template-selector`),O(`sample.treeview.toggle-theme`);let k=c(`currentPage`),{isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N}=C(l(()=>k?.value||`treeview`).value);l(()=>A.value?``:``),l(()=>O(A.value?`sample.treeview.remove-from-favorites`:`sample.treeview.add-to-favorites`));let P=l(()=>({WorkDocuments:O(`sample.treeview.node.work-documents`),XyzFunctionalSpec:O(`sample.treeview.node.xyz-functional-spec`),FeatureSchedule:O(`sample.treeview.node.feature-schedule`),PersonalDocuments:O(`sample.treeview.node.personal-documents`),HomeRemodel:O(`sample.treeview.node.home-remodel`),ContractorContactInfo:O(`sample.treeview.node.contractor-contact-info`),PaintColorScheme:O(`sample.treeview.node.paint-color-scheme`),Documents:O(`sample.treeview.node.documents`),ProjectProposal:O(`sample.treeview.node.project-proposal`),BudgetReport:O(`sample.treeview.node.budget-report`),Projects:O(`sample.treeview.node.projects`),ProjectPlan:O(`sample.treeview.node.project-plan`)}));return l(()=>[{Name:P.value.Documents,Type:`Folder`,Children:[{Name:P.value.ProjectProposal,Type:`File`,Children:[]},{Name:P.value.BudgetReport,Type:`File`,Children:[]}]},{Name:P.value.Projects,Type:`Folder`,Children:[{Name:P.value.ProjectPlan,Type:`File`,Children:[]}]}]),(i,o)=>{let c=a(`TreeViewItem`),l=a(`DataTemplate`),p=a(`TreeViewNode`),C=a(`TreeViewNode.Children`);return d(),g(n,null,{default:t(()=>[u(n.Resources,null,{default:t(()=>[u(l,{"x:Key":`FolderTemplate`,"x:DataType":`controlpages:ExplorerItem`},{default:t(()=>[u(c,{"AutomationProperties.Name":`{x:Bind Name}`,IsExpanded:`True`,ItemsSource:`{x:Bind Children}`},{default:t(()=>[u(y,{Orientation:`Horizontal`},{default:t(()=>[u(v,{Width:`20`,Source:`https://cdn.jsdelivr.net/gh/microsoft/WinUI-Gallery@main/WinUIGallery/Assets/SampleMedia/folder.png`}),u(f,{Margin:`0,0,10,0`}),u(f,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),u(l,{"x:Key":`FileTemplate`,"x:DataType":`controlpages:ExplorerItem`},{default:t(()=>[u(c,{"AutomationProperties.Name":`{x:Bind Name}`},{default:t(()=>[u(y,{Orientation:`Horizontal`},{default:t(()=>[u(s,{Glyph:``}),u(f,{Margin:`0,0,10,0`}),u(f,{Text:`{x:Bind Name}`})]),_:1})]),_:1})]),_:1}),u(e(m),{"x:Key":`ExplorerItemTemplateSelector`,FileTemplate:`{StaticResource FileTemplate}`,FolderTemplate:`{StaticResource FolderTemplate}`})]),_:1}),u(h,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(y,{class:`gallery-item-page`},{default:t(()=>[u(y,{class:`page-heading`},{default:t(()=>[u(f,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),u(f,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(y,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(_,{class:`header-action`,"AutomationProperties.Name":`{x:Bind themeButtonAutomationName, Mode=OneWay}`,Click:`toggleTheme`},{default:t(()=>[u(f,{class:`icon`,Text:``})]),_:1}),u(b,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteButtonAutomationName, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:t(()=>[u(f,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(y,{class:`gallery-page-content`},{default:t(()=>[u(x,{SampleDefinition:`TreeView\\SimpleTreeviewDragDrop.txt`,HeaderText:`{x:Bind dragDropHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dragDropSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind dragDropSample.cSharp, Mode=OneWay}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(r,{Height:`280`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:t(()=>[u(S,{"x:Name":`sampleTreeView`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,AllowDrop:`True`,CanDragItems:`True`},{default:t(()=>[u(S.RootNodes,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.WorkDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:t(()=>[u(C,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.XyzFunctionalSpec, Mode=OneWay}`}),u(p,{Content:`{x:Bind TreeText.FeatureSchedule, Mode=OneWay}`})]),_:1})]),_:1}),u(p,{Content:`{x:Bind TreeText.PersonalDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:t(()=>[u(C,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.HomeRemodel, Mode=OneWay}`,IsExpanded:`True`},{default:t(()=>[u(C,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.ContractorContactInfo, Mode=OneWay}`}),u(p,{Content:`{x:Bind TreeText.PaintColorScheme, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(x.Output),u(x.Options)]),_:1}),u(x,{SampleDefinition:`TreeView\\TreeviewMultiSelectionEnabled.txt`,HeaderText:`{x:Bind multiSelectionHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind multiSelectionSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind multiSelectionSample.cSharp, Mode=OneWay}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(r,{Height:`280`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:t(()=>[u(S,{"x:Name":`sampleTreeView2`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,SelectionMode:`Multiple`},{default:t(()=>[u(S.RootNodes,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.WorkDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:t(()=>[u(C,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.XyzFunctionalSpec, Mode=OneWay}`}),u(p,{Content:`{x:Bind TreeText.FeatureSchedule, Mode=OneWay}`})]),_:1})]),_:1}),u(p,{Content:`{x:Bind TreeText.PersonalDocuments, Mode=OneWay}`,IsExpanded:`True`},{default:t(()=>[u(C,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.HomeRemodel, Mode=OneWay}`,IsExpanded:`True`},{default:t(()=>[u(C,null,{default:t(()=>[u(p,{Content:`{x:Bind TreeText.ContractorContactInfo, Mode=OneWay}`}),u(p,{Content:`{x:Bind TreeText.PaintColorScheme, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(x.Output),u(x.Options)]),_:1}),u(x,{SampleDefinition:`TreeView\\TreeviewDatabindingItemsource.txt`,HeaderText:`{x:Bind dataBindingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind dataBindingSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind dataBindingSample.cSharp, Mode=OneWay}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(r,{Height:`200`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:t(()=>[u(S,{"x:Name":`TreeView1`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,ItemsSource:`{x:Bind DataSource}`},{default:t(()=>[u(S.ItemTemplate,null,{default:t(()=>[u(l,{"x:DataType":`controlpages:ExplorerItem`},{default:t(()=>[u(c,{Content:`{x:Bind Name}`,IsExpanded:`True`,ItemsSource:`{x:Bind Children}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(x.Output),u(x.Options)]),_:1}),u(x,{SampleDefinition:`TreeView\\TreeviewItemtemplateselector.txt`,HeaderText:`{x:Bind templateSelectorHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind templateSelectorSample.xaml, Mode=OneWay}`,CSharp:`{x:Bind templateSelectorSample.cSharp, Mode=OneWay}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(r,{Height:`200`,BorderBrush:`{ThemeResource TextControlBorderBrush}`,BorderThickness:`1`},{default:t(()=>[u(S,{"x:Name":`FileTree`,"Grid.Column":`2`,MinWidth:`345`,MaxHeight:`400`,Margin:`0,12,0,0`,HorizontalAlignment:`Center`,VerticalAlignment:`Top`,ItemTemplateSelector:`{StaticResource ExplorerItemTemplateSelector}`,ItemsSource:`{x:Bind DataSource}`})]),_:1})]),_:1}),u(x.Output),u(x.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-369d03da`]]);export{O as default};