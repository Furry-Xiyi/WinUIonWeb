import{Bi as e,Cn as t,En as n,Ht as r,Ji as i,Mn as a,_i as o,bi as s,ci as c,dn as ee,gi as l,ki as u,ln as te,nn as ne,o as re,p as d,t as ie,ui as f,un as ae,wi as p}from"./ScrollViewer-CHNE18MA.js";import{n as oe}from"./ContentPresenter-pBVZeWXF.js";import{t as se}from"./Button-DO0TiUOq.js";import{s as ce}from"./ItemsView-DXNouDjp.js";import{t as le}from"./TextBox-DVeqZNbk.js";import{t as ue}from"./StackPanel-C60XOD66.js";import{t as de}from"./ToggleButton-ZsjZg8Nu.js";import{t as fe}from"./RadioButton-CQiKAPg3.js";import{t as pe}from"./RadioButtons-D2M7r5B8.js";import{t as me}from"./Ellipse-ByFJrG4r.js";import{t as he}from"./ControlExample-BKyw2NwY.js";import{t as ge}from"./Rectangle-BEFL2Zt7.js";import{t as _e}from"./ItemsRepeaterScrollHost-DYLNONRM.js";import{t as ve}from"./pageState-Djrh7EdY.js";import{t as ye}from"./ItemsRepeater-ksO9TWrY.js";var be=String.raw`public sealed partial class ItemsRepeaterPage : ItemsPageBase
{
    private Random random = new Random();
    private int MaxLength = 425;
    public ObservableCollection<Bar>? BarItems;

    public ItemsRepeaterPage()
    {
        InitializeComponent();
        InitializeData();
    }

    private void InitializeData()
    {
        BarItems = new ObservableCollection<Bar>();
        BarItems.Add(new Bar(300, MaxLength));
        BarItems.Add(new Bar(25, MaxLength));
        BarItems.Add(new Bar(175, MaxLength));
        repeater.ItemsSource = BarItems;
    }

    private void AddBtn_Click(object sender, RoutedEventArgs e)
    {
        BarItems?.Add(new Bar(random.Next(MaxLength), MaxLength));
        DeleteBtn.IsEnabled = true;
    }

    private void DeleteBtn_Click(object sender, RoutedEventArgs e)
    {
        if (BarItems?.Count > 0)
        {
            BarItems.RemoveAt(0);
            DeleteBtn.IsEnabled = BarItems.Count > 0;
        }
    }

    private void RadioBtn_Click(object sender, SelectionChangedEventArgs e)
    {
        if (((sender as RadioButtons)?.SelectedItem as FrameworkElement)?.Tag is not string layoutKey)
        {
            return;
        }

        string itemTemplateKey;
        if (layoutKey == nameof(VerticalStackLayout))
        {
            itemTemplateKey = "HorizontalBarTemplate";
            repeater.MaxWidth = MaxLength + 12;
        }
        else if (layoutKey == nameof(HorizontalStackLayout))
        {
            itemTemplateKey = "VerticalBarTemplate";
            repeater.MaxWidth = 6000;
        }
        else
        {
            itemTemplateKey = "CircularTemplate";
            repeater.MaxWidth = 540;
        }

        repeater.Layout = Resources[layoutKey] as VirtualizingLayout;
        repeater.ItemTemplate = Resources[itemTemplateKey] as DataTemplate;
        repeater.ItemsSource = BarItems;
    }
}

public class Bar
{
    public Bar(double length, int max)
    {
        Length = length;
        MaxLength = max;

        Height = length / 4;
        MaxHeight = max / 4;

        Diameter = length / 6;
        MaxDiameter = max / 6;
    }
    public double Length { get; set; }
    public int MaxLength { get; set; }

    public double Height { get; set; }
    public double MaxHeight { get; set; }

    public double Diameter { get; set; }
    public double MaxDiameter { get; set; }
}`,xe=String.raw`public partial class MyDataTemplateSelector : DataTemplateSelector
{
    public DataTemplate? Normal { get; set; }
    public DataTemplate? Accent { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        if ((int)item % 2 == 0)
        {
            return Normal;
        }
        else
        {
            return Accent;
        }
    }
}`,Se=String.raw`<!-- XAML Code -->

<!-- This is the ItemsRepeater used in this example: -->
<ItemsRepeater x:Name="MixedTypeRepeater"
               Margin="0,0,12,0"
               HorizontalAlignment="Stretch"
               ItemTemplate="{StaticResource StringOrIntTemplateSelector}">

    <ItemsRepeater.Layout>
        <UniformGridLayout MinItemWidth="200" MinItemHeight="200"/>
    </ItemsRepeater.Layout>
</ItemsRepeater>

<!-- The ItemsSource is bound in the C# code-behind to an ObservableCollection called
StringsAndInts. StringsAndInts has both string objects and integer objects. The ItemTemplate
is a DataTemplateSelector called StringOrIntTemplateSelector, and is defined in the
code-behind and shown in the C# code-behind section below. The layout is a simple
UniformGridLayout where each item is a 200x200 square. -->

<!-- StringOrIntTemplateSelector assesses the type of an item, and returns StringDataTemplate if
the item is a string, and IntDataTemplate if the item is an integer.
The XAML code directly below binds the DataTemplateSelector to those two data templates, and
defines each of them: -->

<StringOrIntTemplateSelector x:Key="StringOrIntTemplateSelector"
                             StringTemplate="{StaticResource StringDataTemplate}"
                             IntTemplate="{StaticResource IntDataTemplate}"/>

<DataTemplate x:Key="StringDataTemplate" x:DataType="x:String">
    <Grid Background="{ThemeResource SystemControlBackgroundAccentBrush}" Margin="10">
        <TextBlock Padding="10" Text="{x:Bind}"
                   Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}"
                   HorizontalAlignment="Center" TextWrapping="Wrap"
                   VerticalAlignment="Center"/>
     </Grid>
</DataTemplate>

<DataTemplate x:Key="IntDataTemplate" x:DataType="x:Int32">
    <Grid Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}" Margin="10">
        <TextBlock Padding="10" Text="{x:Bind}"
                   Style="{StaticResource HeaderTextBlockStyle}"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </Grid>
</DataTemplate>`,Ce=String.raw`// C# code-behind

public class StringOrIntTemplateSelector : DataTemplateSelector
{
    // Define the (currently empty) data templates to return
    // These will be "filled-in" in the XAML code.
    public DataTemplate? StringTemplate { get; set; }

    public DataTemplate? IntTemplate { get; set; }

    protected override DataTemplate? SelectTemplateCore(object item)
    {
        // Return the correct data template based on the item's type.
        if (item.GetType() == typeof(String))
        {
            return StringTemplate;
        }
        else if (item.GetType() == typeof(int))
        {
            return IntTemplate;
        }
        else
        {
            return null;
        }
    }
}`,we=String.raw`<!-- The nested ItemsRepeater experience is achieved by creating one ItemsRepeater (outerRepeater below)
and creating another ItemsRepeater (innerRepeater below) inside the outer one's DataTemplate. Below is
the outer ItemsRepeater definition and the DataTemplate it uses. -->

<ScrollViewer HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto">
    <ItemsRepeater
        x:Name="outerRepeater"
        VerticalAlignment="Top"
        ItemTemplate ="{StaticResource CategoryTemplate}">
        <ItemsRepeater.Layout>
           <StackLayout Orientation="Vertical" />
        </ItemsRepeater.Layout>
    </ItemsRepeater>
</ScrollViewer>

<DataTemplate x:Key="CategoryTemplate" x:DataType="l:NestedCategory">
    <StackPanel>
        <TextBlock Text="{x:Bind CategoryName}" Padding="8" Style="{StaticResource TitleTextBlockStyle}"/>
        <ItemsRepeater x:Name="innerRepeater"
                            ItemsSource="{x:Bind CategoryItems}"
                            ItemTemplate="{StaticResource StringDataTemplate}">
            <ItemsRepeater.Layout>
                <StackLayout Orientation="Horizontal" />
            </ItemsRepeater.Layout>
        </ItemsRepeater>
    </StackPanel>
</DataTemplate>

<!-- The DataTemplate shown above is bound to a custom-class type called NestedCategory,
which is defined in the code-behind. NestedCategory objects have the following two attributes:
a CategoryName (string), and a collection of strings called CategoryItems. -->

<!-- The inner ItemsRepeater is bound to its own, separate DataTemplate called StringDataTemplate: -->

<DataTemplate x:Key="StringDataTemplate" x:DataType="x:String">
    <Grid Background="{ThemeResource SystemControlBackgroundAccentBrush}" Margin="10">
        <TextBlock Padding="10" Text="{x:Bind}"
                   Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}"
                   HorizontalAlignment="Center" TextWrapping="Wrap" VerticalAlignment="Center"/>
    </Grid>
</DataTemplate>`,Te=String.raw`public class NestedCategory
{
    public string CategoryName { get; set; }
    public ObservableCollection<string> CategoryItems { get; set; }
    public NestedCategory(string catName, ObservableCollection<string> catItems)
    {
        CategoryName = catName;
        CategoryItems = catItems;
    }
}`,Ee=String.raw`<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="1*" />
        <ColumnDefinition Width="1*" />
    </Grid.ColumnDefinitions>
     <ScrollViewer
        x:Name="Animated_ScrollViewer"
        Grid.Column="0"
        Width="250"
        Height="175">
        <ItemsRepeater
            x:Name="animatedScrollRepeater"
            GettingFocus="OnAnimatedScrollRepeaterGettingFocus"
            KeyDown="OnAnimatedScrollRepeaterKeyDown">
            <DataTemplate x:DataType="x:String">
                <Button
                    HorizontalAlignment="Stretch"
                    Background="{x:Bind}"
                    Click="OnAnimatedItemClicked"
                    Content="{x:Bind}"
                    Foreground="{ThemeResource TextFillColorInverseBrush}"
                    GotFocus="OnAnimatedItemGotFocus" />
            </DataTemplate>
        </ItemsRepeater>
    </ScrollViewer>
     <Rectangle
        x:Name="colorRectangle"
        Grid.Column="1"
        Width="150"
        Height="150"
        Margin="10,0,0,0"
        AutomationProperties.Name="ColorRectangle"
        Stroke="{ThemeResource SystemControlForegroundBaseHighBrush}" />
</Grid>`,De=String.raw`private void OnAnimatedItemGotFocus(object sender, RoutedEventArgs e)
    {
        if (sender is not FrameworkElement item)
        {
            return;
        }

        // Store the last focused Index so we can land back on it when focus leaves
        // and comes back to the repeater.
        PreviouslyFocusedAnimatedScrollRepeaterIndex = animatedScrollRepeater.GetElementIndex(sender as UIElement);

        item.StartBringIntoView(new BringIntoViewOptions()
        {
            VerticalAlignmentRatio = 0.5,
            AnimationDesired = true,
        });
    }
    private void OnAnimatedScrollRepeaterGettingFocus(UIElement sender, GettingFocusEventArgs args)
    {
        // If we have a previously focused index and focus moving from outside the repeater to inside,
        // then we can pick the previously focused index and land on that item again.
        var lastFocus = args.OldFocusedElement as UIElement;
        if (PreviouslyFocusedAnimatedScrollRepeaterIndex != -1 &&
            lastFocus != null && animatedScrollRepeater.GetElementIndex(lastFocus) == -1)
        {
            var item = animatedScrollRepeater.TryGetElement(PreviouslyFocusedAnimatedScrollRepeaterIndex);
            args.NewFocusedElement = item;
        }
    }

    private void OnAnimatedItemClicked(object sender, RoutedEventArgs e)
    {
        if (sender is not Button senderBtn)
        {
            return;
        }

        // Update corresponding rectangle with selected color
        colorRectangle.Fill = senderBtn.Background;
        // announce visual change to automation
        UIHelper.AnnounceActionForAccessibility(senderBtn, $"Rectangle color set to {senderBtn.Content}", "RectangleChangedNotificationActivityId");
        SetUIANamesForSelectedEntry(senderBtn);
    }


    /* This function occurs each time an element is made ready for use.
     * This is necessary for virtualization. */
    private void OnElementPrepared(Microsoft.UI.Xaml.Controls.ItemsRepeater sender, Microsoft.UI.Xaml.Controls.ItemsRepeaterElementPreparedEventArgs args)
    {
        var item = ElementCompositionPreview.GetElementVisual(args.Element);
        var svVisual = ElementCompositionPreview.GetElementVisual(Animated_ScrollViewer);
        var scrollProperties = ElementCompositionPreview.GetScrollViewerManipulationPropertySet(Animated_ScrollViewer);

        var scaleExpresion = scrollProperties.Compositor.CreateExpressionAnimation();
        scaleExpresion.SetReferenceParameter("svVisual", svVisual);
        scaleExpresion.SetReferenceParameter("scrollProperties", scrollProperties);
        scaleExpresion.SetReferenceParameter("item", item);

        // Scale the item based on the distance of the item relative to the center of the viewport.
        scaleExpresion.Expression = "1 - abs((svVisual.Size.Y/2 - scrollProperties.Translation.Y) - (item.Offset.Y + item.Size.Y/2))*(.25/(svVisual.Size.Y/2))";

        // Animate the item to change size based on distance from center of viewpoint
        item.StartAnimation("Scale.X", scaleExpresion);
        item.StartAnimation("Scale.Y", scaleExpresion);
        var centerPointExpression = scrollProperties.Compositor.CreateExpressionAnimation();
        centerPointExpression.SetReferenceParameter("item", item);
        centerPointExpression.Expression = "Vector3(item.Size.X/2, item.Size.Y/2, 0)";
        item.StartAnimation("CenterPoint", centerPointExpression);
    }

    private void SetUIANamesForSelectedEntry(Button selectedItem)
    {
        if (LastSelectedColorButton != null && LastSelectedColorButton.Content is string content)
        {
            AutomationProperties.SetName(LastSelectedColorButton, content);
        }

        AutomationProperties.SetName(selectedItem, (string)selectedItem.Content + " , selected");
        LastSelectedColorButton = selectedItem;
    }

private void OnAnimatedScrollRepeaterKeyDown(object sender, KeyRoutedEventArgs e)
    {
        if (e.Handled != true)
        {
            var targetIndex = -1;
            if (e.Key == Windows.System.VirtualKey.Home)
            {
                targetIndex = PreviouslyFocusedAnimatedScrollRepeaterIndex != 0 ? 0 : -1;
            }
            else if (e.Key == Windows.System.VirtualKey.End)
            {
                targetIndex = PreviouslyFocusedAnimatedScrollRepeaterIndex != animatedScrollRepeater.ItemsSourceView.Count - 1 ?
                    animatedScrollRepeater.ItemsSourceView.Count - 1 : -1;
            }

            if (targetIndex != -1)
            {
                var element = animatedScrollRepeater.GetOrCreateElement(targetIndex);
                element.StartBringIntoView();
                (element as Control)?.Focus(FocusState.Programmatic);
                e.Handled = true;
            }
        }
    }`,Oe=String.raw`<Grid Height="600">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="1*" />
                    <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>
                <ItemsRepeaterScrollHost x:Name="tracker" Grid.Column="0">
                    <ScrollViewer>
                        <ItemsRepeater x:Name="VariedImageSizeRepeater" ItemTemplate="{StaticResource RecipeTemplate}">
                            <ItemsRepeater.Layout>
                                <layouts:VariedImageSizeLayout Width="200" />
                            </ItemsRepeater.Layout>
                        </ItemsRepeater>
                    </ScrollViewer>
                </ItemsRepeaterScrollHost>

                <StackPanel Grid.Column="1" Margin="10,0,0,0">
                    <TextBox
                        x:Name="FilterRecipes"
                        Width="200"
                        Margin="0,0,0,20"
                        HorizontalAlignment="Left"
                        VerticalAlignment="Top"
                        Header="Filter by ingredient..."
                        TextChanged="FilterRecipes_FilterChanged" />
                    <TextBlock Margin="0,0,0,10" Text="Sort by number of ingredients" />
                    <Button
                        Margin="0,0,0,5"
                        Click="OnSortAscClick"
                        Content="Least to most" />
                    <Button Click="OnSortDesClick" Content="Most to least" />
                </StackPanel>
            </Grid>

<DataTemplate x:Key="RecipeTemplate" x:DataType="local:Recipe">
            <StackPanel
                Margin="5"
                Background="{ThemeResource SystemControlBackgroundBaseLowBrush}"
                BorderThickness="1">
                <StackPanel
                    Height="75"
                    Margin="8"
                    Background="{x:Bind Color}"
                    Opacity=".8">
                    <TextBlock
                        Padding="12"
                        FontSize="35"
                        Foreground="{ThemeResource SystemControlForegroundAltHighBrush}"
                        Text="{x:Bind Num.ToString()}"
                        TextAlignment="Center" />
                </StackPanel>
                <TextBlock
                    x:Name="recipeName"
                    Margin="15,0,10,0"
                    Style="{StaticResource TitleTextBlockStyle}"
                    Text="{x:Bind Name}"
                    TextWrapping="Wrap" />
                <TextBlock
                    Margin="15,0,15,15"
                    Style="{StaticResource BodyTextBlockStyle}"
                    Text="{x:Bind Ingredients}" />
            </StackPanel>
        </DataTemplate>`,ke=String.raw`// C# Code

// ==========================  Recipe class used for items ==========================
public class Recipe
{
    public int Num { get; set; }
    public string Ingredients { get; set; } = string.Empty;
    public List<string> IngList { get; set; } = [];
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int NumIngredients
    {
        get
        {
            return IngList.Count();
        }
    }

    public void RandomizeIngredients()
    {
        // To give the items different heights for visual variety, give recipes
        // random numbers of random "extra" ingredients
        Random rndNum = new Random();
        Random rndIng = new Random();

        ObservableCollection<string> extras = new ObservableCollection<string>{
                                                        "Garlic",
                                                        "Lemon",
                                                        "Butter",
                                                        "Lime",
                                                        "Feta Cheese",
                                                        "Parmesan Cheese",
                                                        "Breadcrumbs"};
        for (int i =0; i < rndNum.Next(0,4); i++)
        {
            string newIng = extras[rndIng.Next(0, 6)];
            // If the ingredient is not already present in the recipe, add it
            if (!IngList.Contains(newIng))
            {
                Ingredients += "\n" + newIng;
                IngList.Add(newIng);
            }
        }

    }
}

// ==========================  Data source class ==========================
/* To hold the recipe items, a data source class was created called MyItemsSource. The class
   inherits from IList and IKeyIndexMapping interfaces, basically creating a collection class
   that can easily filter and sort its items. Important methods are shown below, but full source
   code can be found in WinUI Gallery repo. See the linked ItemsRepeater guidance documentation as
   well for a full tutorial on how to implement this type of class. */

public class MyItemsSource : IList,
                             Microsoft.UI.Xaml.Controls.IKeyIndexMapping,
                             INotifyCollectionChanged
{
    private List<Recipe> inner = new List<Recipe>();

    public MyItemsSource(IEnumerable<Recipe> collection)
    {
        InitializeCollection(collection);
    }

    public void InitializeCollection(IEnumerable<Recipe> collection)
    {
        inner.Clear();
        if (collection != null)
        {
            inner.AddRange(collection);
        }

        if (CollectionChanged != null)
        {
            CollectionChanged?.Invoke(
                this,
                new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
        }
    }

    //...

    public string KeyFromIndex(int index)
    {
        return inner[index].Num.ToString();
    }

    public int IndexFromKey(string key)
    {
        foreach (Recipe item in inner)
        {
            if (item.Num.ToString() == key)
            {
                return inner.IndexOf(item);
            }
        }
        return -1;
    }
    // ...

}

// ========================== Initialization code ==========================

public MyItemsSource filteredRecipeData = new MyItemsSource(null);
public List<Recipe> staticRecipeData;

private void InitializeData()
{
    // ...
    // Create a list of Recipe objects, initializing each of them with a random number,
    // correlating name, and random color to associate with it.
    var rnd = new Random();
    List<Recipe> tempList = new List<Recipe>(
                              Enumerable.Range(0, 1000).Select(k =>
                                new Recipe
                                  {
                                    Num = k,
                                    Name = "Recipe " + k.ToString(),
                                    Color = colors[k % 15 + 1]
                                }));

    // The lists fruits, vegetables, grains, and proteins were all populated with strings.
    // This loop goes through each Recipe item and populates its ingredients list with one
    // string from each list/category, then randomizes the ingredients list by adding extras.
    foreach (Recipe rec in tempList)
    {
        string fruitOption = fruits[rnd.Next(0, 6)];
        string vegOption = vegetables[rnd.Next(0, 6)];
        string grainOption = grains[rnd.Next(0, 6)];
        string proteinOption = proteins[rnd.Next(0, 6)];
        rec.Ingredients = "\n" + fruitOption + "\n" + vegOption + "\n" +
        grainOption + "\n" + proteinOption;
        rec.IngList = new List<string>() { fruitOption, vegOption, grainOption, proteinOption };
        rec.RandomizeIngredients();
    }

    // The custom MyItemsSource object, filteredRecipeData, is initialized.
    filteredRecipeData.InitializeCollection(tempList);
    // A static list of the original recipe data is saved to use for filtering.
    staticRecipeData = new List<Recipe>(tempList);
    // The ItemsSource is set for the ItemsRepeater created in the XAML file.
    VariedImageSizeRepeater.ItemsSource = filteredRecipeData;

    // ...
}

// ========================== Filtering, sorting, animating ==========================
public void FilterRecipes_FilterChanged(object sender, RoutedEventArgs e)
{
    UpdateSortAndFilter();
}

private void OnSortAscClick(object sender, RoutedEventArgs e)
{
    if (IsSortDescending == true)
    {
        IsSortDescending = false;
        UpdateSortAndFilter();
    }
}

private void OnSortDesClick(object sender, RoutedEventArgs e)
{
    if (!IsSortDescending == true)
    {
        IsSortDescending = true;
        UpdateSortAndFilter();
    }
}

private void UpdateSortAndFilter()
{
    // This is a Linq query that fetches all Recipes containing the ingredient
    // typed into the filter text box.
    var filteredTypes = staticRecipeData
        .Where(i => i.Ingredients.Contains(
            FilterRecipes.Text,
            StringComparison.InvariantCultureIgnoreCase));
    // After filtering, sort the collection
    var sortedFilteredTypes = IsSortDescending ?
        filteredTypes.OrderByDescending(i => i.NumIngredients) :
        filteredTypes.OrderBy(i => i.NumIngredients);
    // Re-initialize the collection with this newly filtered data
    filteredRecipeData.InitializeCollection(sortedFilteredTypes);
}`,m=425,Ae=`{StaticResource MyDataTemplateSelector}`,h=`MyDataTemplateSelector`,g={__name:`ItemsRepeaterPage`,setup(e,{expose:a}){a();let{t:l}=d(),u=s(`currentPage`),f=c(()=>u?.value||`itemsrepeater`),{isFavoriteState:g,pageTheme:_,toggleTheme:v,toggleFavorite:je}=ve(f.value),Me=c(()=>g.value?``:``),Ne=l(`text.itemsrepeater`),Pe=l(`text.itemsrepeater-description`),Fe=l(`sample.itemsrepeater.basic-non-interactive`),Ie=l(`sample.itemsrepeater.virtualizing-scrollable-list-items`),Le=l(`sample.itemsrepeater.mixed-type-collection`),Re=l(`sample.itemsrepeater.nested`),ze=l(`sample.itemsrepeater.animated-scrolling-content-display`),Be=l(`sample.itemsrepeater.virtualized-content-heavy-layout`),Ve=l(`sample.itemsrepeater.mixed-note`),He=l(`sample.add-item`),Ue=l(`sample.remove-item`),We=l(`sample.layout`),y=l(`sample.itemsrepeater.stack-layout-vertical`),b=l(`sample.itemsrepeater.stack-layout-horizontal`),x=l(`sample.uniform-grid`),S=l(`sample.itemsrepeater.uniform-grid-option`),C=l(`sample.itemsrepeater.custom-virtualizing-layout`),Ge=l(`sample.filter-by-ingredient`),Ke=l(`sample.sort-by-number-of-ingredients`),qe=l(`sample.least-to-most`),Je=l(`sample.most-to-least`),w=e=>({Length:e,MaxLength:m,Height:e/4,MaxHeight:m/4,Diameter:e/6,MaxDiameter:m/6}),T=i([w(300),w(25),w(175)]),Ye=c(()=>T.value.length>0),Xe=()=>{T.value.push(w(Math.floor(Math.random()*m)))},Ze=()=>{T.value.length&&T.value.shift()},E=i(`VerticalStackLayout`),Qe=c(()=>E.value===`HorizontalStackLayout`?6e3:E.value===`UniformGridLayout`?540:437),$e=c(()=>`{StaticResource ${E.value}}`),D=c(()=>E.value===`HorizontalStackLayout`?`VerticalBarTemplate`:E.value===`UniformGridLayout`?`CircularTemplate`:`HorizontalBarTemplate`),et=c(()=>`{StaticResource ${D.value}}`),O=c(()=>({VerticalStackLayout:y,HorizontalStackLayout:b,UniformGridLayout:x})[E.value]),tt=c(()=>l(`sample.itemsrepeater.items-layout-output`,{count:T.value.length,layout:O.value})),nt=e=>{let t=e?.SelectedItem?.Tag;typeof t!=`string`||!(t in Q)||(E.value=t)},k=i(Array.from({length:500},(e,t)=>t)),rt=o({name:`MyDataTemplateSelector`,SelectTemplateCore:e=>Number(e)%2==0?`Normal`:`Accent`,setup:()=>()=>null}),A=i(`MyFeedLayout`),it=c(()=>`{StaticResource ${A.value}}`),at=c(()=>l(`sample.itemsrepeater.items-layout-output`,{count:k.value.length,layout:A.value===`MyFeedLayout`?C:S})),j=i(`<common:ActivityFeedLayout x:Key="MyFeedLayout" ColumnSpacing="12"
                          RowSpacing="12" MinItemSize="80, 108"/>`),ot=e=>{let t=e?.SelectedItem?.Tag;typeof t==`string`&&(A.value=t,j.value=t===`UniformGridLayout2`?`<UniformGridLayout x:Key="UniformGridLayout2" MinItemWidth="108" MinItemHeight="108"
                       MinRowSpacing="12" MinColumnSpacing="12"/>`:`<common:ActivityFeedLayout x:Key="MyFeedLayout" ColumnSpacing="12"
                          RowSpacing="12" MinItemSize="80, 108"/>`)},M=[64,l(`sample.itemsrepeater.mixed-text-1`),128,l(`sample.itemsrepeater.mixed-text-2`),256,l(`sample.itemsrepeater.mixed-text-3`),512,l(`sample.itemsrepeater.mixed-text-4`),1024],st=o({name:`StringOrIntTemplateSelector`,SelectTemplateCore:e=>typeof e==`string`?`StringTemplate`:`IntTemplate`,setup:()=>()=>null}),ct=c(()=>l(`sample.itemsrepeater.mixed-output`,{integers:M.filter(e=>typeof e==`number`).length,strings:M.filter(e=>typeof e==`string`).length})),N={fruits:[`apricots`,`bananas`,`grapes`,`strawberries`,`watermelon`,`plums`,`blueberries`],vegetables:[`broccoli`,`spinach`,`sweet-potato`,`cauliflower`,`onion`,`brussels-sprouts`,`carrots`],grains:[`rice`,`quinoa`,`pasta`,`bread`,`farro`,`oats`,`barley`],proteins:[`steak`,`chicken`,`tofu`,`salmon`,`pork`,`chickpeas`,`eggs`]},P=Object.fromEntries(Object.entries(N).map(([e,t])=>[e,t.map(e=>l(`sample.itemsrepeater.food.${e}`))])),F=Object.entries(P).map(([e,t])=>({CategoryName:l(`sample.itemsrepeater.category.${e}`),CategoryItems:t})),lt=c(()=>l(`sample.itemsrepeater.nested-output`,{categories:F.length,items:F.reduce((e,t)=>e+t.CategoryItems.length,0)})),I=[`Blue`,`BlueViolet`,`Crimson`,`DarkCyan`,`DarkGoldenrod`,`DarkMagenta`,`DarkOliveGreen`,`DarkRed`,`DarkSlateBlue`,`DeepPink`,`IndianRed`,`MediumSlateBlue`,`Maroon`,`MidnightBlue`,`Peru`,`SaddleBrown`,`SteelBlue`,`OrangeRed`,`Firebrick`,`DarkKhaki`],L=i(``),R=i(``),z=I.map(e=>({Color:e,Name:l(`sample.itemsrepeater.color.${e}`)})),ut=l(`sample.itemsrepeater.color-rectangle`),dt=c(()=>R.value?l(`sample.itemsrepeater.selected-color-output`,{color:R.value}):l(`sample.itemsrepeater.no-color-selected`)),B=new Set,V=-1,H=e=>e?.closest(`.win-scroll-viewer-viewport`),U=e=>{let t=H(e),n=e.parentElement;if(!t||!t.clientHeight)return;let r=1-Math.abs(t.clientHeight/2+t.scrollTop-(n.offsetTop+e.offsetHeight/2))*(.25/(t.clientHeight/2));e.style.transformOrigin=`center`,e.style.scale=String(r)},ft=e=>{B.add(e.Element),U(e.Element)},pt=e=>{B.delete(e.Element),e.Element.style.removeProperty(`scale`)},mt=()=>{for(let e of B)U(e)},ht=(e,t)=>{let n=e?.Element??t?.OriginalEvent?.target?.closest?.(`.win-btn`);if(!n?.parentElement)return;V=Number(n.parentElement.dataset.index);let r=H(n);r?.scrollTo({top:n.parentElement.offsetTop+n.offsetHeight/2-r.clientHeight/2,behavior:`smooth`})},gt=e=>{let t=e.NewFocusedElement?.closest(`.win-items-repeater`);V>=0&&e.OldFocusedElement&&!t?.contains(e.OldFocusedElement)&&(e.NewFocusedElement=t?.querySelector(`:scope > [data-index="${V}"] button`)??e.NewFocusedElement)},_t=e=>{let t=e.Key===`Home`?0:e.Key===`End`?z.length-1:-1;t<0||t===V||(e.OriginalSource.closest(`.win-items-repeater`)?.querySelector(`:scope > [data-index="${t}"] button`)?.focus({preventScroll:!0}),e.Handled=!0)};p(()=>B.clear());let vt=(e,t)=>{let n=e?.Element??t?.OriginalEvent?.target?.closest?.(`.win-btn`),r=Number(n?.parentElement?.dataset.index);if(z[r]){L.value=z[r].Color,R.value=z[r].Name;for(let e of B)e.removeAttribute(`aria-current`);n.setAttribute(`aria-current`,`true`)}},W=Object.values(P),G=[`garlic`,`lemon`,`butter`,`lime`,`feta-cheese`,`parmesan-cheese`,`breadcrumbs`].map(e=>l(`sample.itemsrepeater.food.${e}`)),K=e=>e[Math.floor(Math.random()*(e.length-1))],q=e=>Array.from({length:e},(e,t)=>{let n=W.map(e=>K(e)),r=Math.floor(Math.random()*4);for(let e=0;e<r;e+=1){let e=K(G);n.includes(e)||n.push(e)}return{Num:t,Name:l(`sample.itemsrepeater.recipe-name`,{number:t}),Color:K(I),IngList:n,Ingredients:`\n${n.join(`
`)}`}}),J=q(1e3),Y=i(``),X=i(!1),Z=i(!1),yt=c(()=>{let e=Y.value.toLowerCase(),t=e?J.filter(t=>t.Ingredients.toLowerCase().includes(e)):J;return Z.value?[...t].sort((e,t)=>X.value?t.IngList.length-e.IngList.length:e.IngList.length-t.IngList.length):t}),bt=c(()=>l(`sample.itemsrepeater.filtered-recipes-output`,{count:yt.value.length})),xt=()=>{Z.value=!0},St=()=>{X.value&&(X.value=!1,Z.value=!0)},Ct=()=>{X.value||(X.value=!0,Z.value=!0)},Q={VerticalStackLayout:`<StackLayout x:Name="VerticalStackLayout" Orientation="Vertical" Spacing="8"/>`,HorizontalStackLayout:`<StackLayout x:Name="HorizontalStackLayout" Orientation="Horizontal" Spacing="8"/>`,UniformGridLayout:`<UniformGridLayout x:Name="UniformGridLayout" MinRowSpacing="8" MinColumnSpacing="8"/>`},wt={VerticalStackLayout:`<DataTemplate x:Key="HorizontalBarTemplate" x:DataType="l:Bar">
    <Border Background="{ThemeResource SystemChromeLowColor}" Width="{x:Bind MaxLength}" >
        <Rectangle Fill="{ThemeResource SystemAccentColor}" Width="{x:Bind Length}"
                   Height="24" HorizontalAlignment="Left"/>
    </Border>
</DataTemplate>`,HorizontalStackLayout:`<DataTemplate x:Key="VerticalBarTemplate" x:DataType="l:Bar">
    <Border Background="{ThemeResource SystemChromeLowColor}" Height="{x:Bind MaxHeight}">
        <Rectangle Fill="{ThemeResource SystemAccentColor}" Height="{x:Bind Height}"
                   Width="48" VerticalAlignment="Top"/>
    </Border>
</DataTemplate>`,UniformGridLayout:`<DataTemplate x:Key="CircularTemplate" x:DataType="l:Bar">
    <Grid>
        <Ellipse Fill="{ThemeResource SystemChromeLowColor}" Height="{x:Bind MaxDiameter}"
                 Width="{x:Bind MaxDiameter}" VerticalAlignment="Center" HorizontalAlignment="Center"/>
        <Ellipse Fill="{ThemeResource SystemAccentColor}" Height="{x:Bind Diameter}"
                 Width="{x:Bind Diameter}" VerticalAlignment="Center" HorizontalAlignment="Center"/>
    </Grid>
</DataTemplate>`},$={t:l,currentPage:u,pageKey:f,isFavoriteState:g,pageTheme:_,toggleTheme:v,toggleFavorite:je,favoriteGlyph:Me,pageTitle:Ne,pageDescription:Pe,basicHeader:Fe,virtualizingHeader:Ie,mixedHeader:Le,nestedHeader:Re,animatedHeader:ze,heavyHeader:Be,mixedNote:Ve,addItemLabel:He,removeItemLabel:Ue,layoutLabel:We,stackLayoutVerticalLabel:y,stackLayoutHorizontalLabel:b,uniformGridLayoutLabel:x,uniformGridOptionLabel:S,customVirtualizingLayoutLabel:C,filterLabel:Ge,sortLabel:Ke,leastToMostLabel:qe,mostToLeastLabel:Je,maxLength:m,makeBar:w,barItems:T,canDeleteBar:Ye,AddBtn_Click:Xe,DeleteBtn_Click:Ze,basicLayoutKey:E,basicRepeaterMaxWidth:Qe,basicLayout:$e,basicTemplateKey:D,basicTemplate:et,basicLayoutLabel:O,basicOutput:tt,RadioBtn_Click:nt,numbers:k,MyDataTemplateSelector:rt,virtualizingLayoutKey:A,virtualizingLayout:it,virtualizingOutput:at,virtualizingTemplate:Ae,virtualizingTemplateSubstitution:h,sampleCodeLayout2:j,LayoutBtn_SelectionChanged:ot,mixedItems:M,StringOrIntTemplateSelector:st,mixedOutput:ct,foodGroups:N,nestedItems:P,categories:F,nestedOutput:lt,colors:I,selectedColor:L,selectedColorName:R,colorItems:z,colorRectangleLabel:ut,selectedColorOutput:dt,animatedElements:B,get previouslyFocusedIndex(){return V},set previouslyFocusedIndex(e){V=e},animatedViewport:H,updateAnimatedScale:U,OnElementPrepared:ft,OnElementClearing:pt,Animated_ScrollViewer_ViewChanged:mt,OnAnimatedItemGotFocus:ht,OnAnimatedScrollRepeaterGettingFocus:gt,OnAnimatedScrollRepeaterKeyDown:_t,OnAnimatedItemClicked:vt,ingredientsByCategory:W,extras:G,pick:K,buildRecipes:q,staticRecipes:J,recipeFilter:Y,isSortDescending:X,sortRequested:Z,visibleRecipes:yt,filteredRecipesOutput:bt,FilterRecipes_FilterChanged:xt,OnSortAscClick:St,OnSortDesClick:Ct,sampleCodeLayouts:Q,sampleCodeTemplates:wt,basicXaml:c(()=>`<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer HorizontalScrollBarVisibility="Auto"
              HorizontalScrollMode="Auto"
              IsVerticalScrollChainingEnabled="False"
              MaxHeight="500">
    <ItemsRepeater x:Name="repeater"
               ItemsSource="{x:Bind BarItems}"
               Layout="{StaticResource ${E.value}}"
               ItemTemplate="{StaticResource ${D.value}}" />
</ScrollViewer>

<!-- The Layout specifications used: -->

${Q[E.value]}

<!-- The DataTemplate used: ${D.value}-->

${wt[E.value]}`),virtualizingXaml:c(()=>`<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer x:Name="scrollViewer"
                Height="400"
                IsVerticalScrollChainingEnabled="False"
                Padding="0,0,16,0">
    <ItemsRepeater
            ItemsSource="{x:Bind Numbers}"
            Layout="{StaticResource ${A.value}}"
            ItemTemplate="{StaticResource ${h}}" />
</ScrollViewer>

<!-- The Layout specifications used: -->

${j.value}

<!-- The ItemTemplate is bound to a DataTemplateSelector called MyDataTemplateSelector.
MyDataTemplateSelector is defined in the code-behind to return the Accent DataTemplate
for odd-numbered-items, and returns the Normal DataTemplate for even-numbered-items
(shown in C# code-behind section below). The two data templates and the XAML declaration
of MyDataTemplateSelector are below: -->

<MyDataTemplateSelector x:Key="MyDataTemplateSelector"
                            Normal="{StaticResource NormalItemTemplate}"
                            Accent="{StaticResource AccentItemTemplate}"/>

<DataTemplate x:Key="NormalItemTemplate" x:DataType="x:Int32">
    <Border Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}">
        <TextBlock Text="{x:Bind}" HorizontalAlignment="Center" VerticalAlignment="Center" />
    </Border>
</DataTemplate>

<DataTemplate x:Key="AccentItemTemplate" x:DataType="x:Int32">
    <Border Background="{ThemeResource SystemControlBackgroundAccentBrush}">
        <TextBlock Text="{x:Bind}" HorizontalAlignment="Center" VerticalAlignment="Center"
                   Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}" />
    </Border>
</DataTemplate>

<!-- The ItemsSource for this ItemsRepeater is the Numbers collection. -->

<!-- ActivityFeedLayout is a custom designed virtualizing layout that loads images only as you come
accross them, defined in the code-behind. View the WinUI Gallery source code to see more
details about this custom layout. -->`),computed:c,defineComponent:o,inject:s,onBeforeUnmount:p,ref:i,get basicCSharp(){return be},get virtualizingCSharp(){return xe},get mixedXaml(){return Se},get mixedCSharp(){return Ce},get nestedXaml(){return we},get nestedCSharp(){return Te},get animatedXaml(){return Ee},get animatedCSharp(){return De},get heavyXaml(){return Oe},get heavyCSharp(){return ke},Border:oe,Ellipse:me,get ActivityFeedLayout(){return r},get DataTemplate(){return ne},get StackLayout(){return te},get UniformGridLayout(){return ae},get VariedImageSizeLayout(){return ee},Button:se,ColumnDefinition:ce,ControlExample:he,Grid:n,ItemsRepeater:ye,ItemsRepeaterScrollHost:_e,Page:t,RadioButtons:pe,RadioButton:fe,Rectangle:ge,ScrollViewer:ie,StackPanel:ue,TextBlock:re,TextBox:le,ToggleButton:de,get useI18n(){return d},get createPageState(){return ve}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}};function _(t,n,r,i,a,o){return u(),f(i.Page,null,{default:e(()=>[l(i.Page.Resources,null,{default:e(()=>[l(i.DataTemplate,{"x:Key":`HorizontalBarTemplate`,"x:DataType":`local:Bar`},{default:e(()=>[l(i.Border,{Width:`{x:Bind MaxLength}`,Background:`{ThemeResource SystemChromeLowColor}`},{default:e(()=>[l(i.Rectangle,{Width:`{x:Bind Length}`,Height:`24`,HorizontalAlignment:`Left`,Fill:`{ThemeResource SystemAccentColor}`})]),_:1})]),_:1}),l(i.DataTemplate,{"x:Key":`VerticalBarTemplate`,"x:DataType":`local:Bar`},{default:e(()=>[l(i.Border,{Height:`{x:Bind MaxHeight}`,Background:`{ThemeResource SystemChromeLowColor}`},{default:e(()=>[l(i.Rectangle,{Width:`48`,Height:`{x:Bind Height}`,VerticalAlignment:`Top`,Fill:`{ThemeResource SystemAccentColor}`})]),_:1})]),_:1}),l(i.DataTemplate,{"x:Key":`CircularTemplate`,"x:DataType":`local:Bar`},{default:e(()=>[l(i.Grid,null,{default:e(()=>[l(i.Ellipse,{Width:`{x:Bind MaxDiameter}`,Height:`{x:Bind MaxDiameter}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Fill:`{ThemeResource SystemChromeLowColor}`}),l(i.Ellipse,{Width:`{x:Bind Diameter}`,Height:`{x:Bind Diameter}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Fill:`{ThemeResource SystemAccentColor}`})]),_:1})]),_:1}),l(i.StackLayout,{"x:Name":`VerticalStackLayout`,Orientation:`Vertical`,Spacing:`8`}),l(i.StackLayout,{"x:Name":`HorizontalStackLayout`,Orientation:`Horizontal`,Spacing:`8`}),l(i.UniformGridLayout,{"x:Name":`UniformGridLayout`,MinRowSpacing:`8`,MinColumnSpacing:`8`}),l(i.DataTemplate,{"x:Key":`NormalItemTemplate`,"x:DataType":`x:Int32`},{default:e(()=>[l(i.Border,{Background:`{ThemeResource SystemControlBackgroundChromeMediumBrush}`},{default:e(()=>[l(i.TextBlock,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind}`})]),_:1})]),_:1}),l(i.DataTemplate,{"x:Key":`AccentItemTemplate`,"x:DataType":`x:Int32`},{default:e(()=>[l(i.Border,{Background:`{ThemeResource SystemControlBackgroundAccentBrush}`},{default:e(()=>[l(i.TextBlock,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Foreground:`{ThemeResource SystemControlForegroundChromeWhiteBrush}`,Text:`{x:Bind}`})]),_:1})]),_:1}),l(i.UniformGridLayout,{"x:Key":`UniformGridLayout2`,MinItemWidth:`108`,MinItemHeight:`108`,MinRowSpacing:`12`,MinColumnSpacing:`12`}),l(i.ActivityFeedLayout,{"x:Key":`MyFeedLayout`,ColumnSpacing:`12`,RowSpacing:`12`,MinItemSize:`80, 108`}),l(i.MyDataTemplateSelector,{"x:Key":`MyDataTemplateSelector`,Normal:`{StaticResource NormalItemTemplate}`,Accent:`{StaticResource AccentItemTemplate}`}),l(i.StringOrIntTemplateSelector,{"x:Key":`StringOrIntTemplateSelector`,StringTemplate:`{StaticResource StringDataTemplate}`,IntTemplate:`{StaticResource IntDataTemplate}`}),l(i.DataTemplate,{"x:Key":`StringDataTemplate`,"x:DataType":`x:String`},{default:e(()=>[l(i.Grid,{Margin:`10`,Background:`{ThemeResource SystemControlBackgroundAccentBrush}`},{default:e(()=>[l(i.TextBlock,{Padding:`10`,Text:`{x:Bind}`,Foreground:`{ThemeResource SystemControlForegroundChromeWhiteBrush}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,TextWrapping:`Wrap`})]),_:1})]),_:1}),l(i.DataTemplate,{"x:Key":`IntDataTemplate`,"x:DataType":`x:Int32`},{default:e(()=>[l(i.Grid,{Margin:`10`,Background:`{ThemeResource SystemControlBackgroundChromeMediumBrush}`},{default:e(()=>[l(i.TextBlock,{Padding:`10`,Text:`{x:Bind}`,Style:`{StaticResource HeaderTextBlockStyle}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`})]),_:1})]),_:1}),l(i.DataTemplate,{"x:Key":`CategoryTemplate`,"x:DataType":`local:NestedCategory`},{default:e(()=>[l(i.StackPanel,null,{default:e(()=>[l(i.TextBlock,{Padding:`8`,Text:`{x:Bind CategoryName}`,Style:`{StaticResource TitleTextBlockStyle}`}),l(i.ItemsRepeater,{"x:Name":`innerRepeater`,ItemsSource:`{x:Bind CategoryItems}`,ItemTemplate:`{StaticResource StringDataTemplate}`},{default:e(()=>[l(i.ItemsRepeater.Layout,null,{default:e(()=>[l(i.StackLayout,{Orientation:`Horizontal`})]),_:1})]),_:1})]),_:1})]),_:1}),l(i.DataTemplate,{"x:Key":`RecipeTemplate`,"x:DataType":`local:Recipe`},{default:e(()=>[l(i.StackPanel,{Margin:`5`,Background:`{ThemeResource SystemControlBackgroundBaseLowBrush}`,BorderThickness:`1`},{default:e(()=>[l(i.StackPanel,{Height:`75`,Margin:`8`,Opacity:`.8`,Background:`{x:Bind Color}`},{default:e(()=>[l(i.TextBlock,{Padding:`12`,Text:`{x:Bind Num.ToString()}`,FontSize:`35`,TextAlignment:`Center`,Foreground:`{ThemeResource SystemControlForegroundAltHighBrush}`})]),_:1}),l(i.TextBlock,{Margin:`15,0,10,0`,Text:`{x:Bind Name}`,Style:`{StaticResource TitleTextBlockStyle}`,TextWrapping:`Wrap`}),l(i.TextBlock,{Margin:`15,0,15,15`,Text:`{x:Bind Ingredients}`,Style:`{StaticResource BodyTextBlockStyle}`})]),_:1})]),_:1})]),_:1}),l(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[l(i.StackPanel,{class:`page-heading`},{default:e(()=>[l(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),l(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[l(i.Button,{class:`header-action`,Click:`toggleTheme`},{default:e(()=>[l(i.TextBlock,{class:`icon`,Text:``})]),_:1}),l(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:e(()=>[l(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),l(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[l(i.ControlExample,{HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicXaml, Mode=OneWay}`,CSharp:`{x:Bind basicCSharp, Mode=OneWay}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.ScrollViewer,{MaxHeight:`500`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,IsVerticalScrollChainingEnabled:`False`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(i.ItemsRepeater,{MaxWidth:`{x:Bind basicRepeaterMaxWidth, Mode=OneWay}`,ItemsSource:`{x:Bind barItems, Mode=OneWay}`,ItemTemplate:`{x:Bind basicTemplate, Mode=OneWay}`,Layout:`{x:Bind basicLayout, Mode=OneWay}`})]),_:1})]),_:1}),l(i.ControlExample.Options,null,{default:e(()=>[l(i.StackPanel,{Spacing:`12`},{default:e(()=>[l(i.Button,{MinWidth:`150`,Click:`AddBtn_Click`,Content:`{x:Bind addItemLabel, Mode=OneWay}`}),l(i.Button,{MinWidth:`150`,Click:`DeleteBtn_Click`,IsEnabled:`{x:Bind canDeleteBar, Mode=OneWay}`,Content:`{x:Bind removeItemLabel, Mode=OneWay}`}),l(i.RadioButtons,{Header:`{x:Bind layoutLabel, Mode=OneWay}`,SelectionChanged:`RadioBtn_Click`},{default:e(()=>[l(i.RadioButton,{Content:`{x:Bind stackLayoutVerticalLabel, Mode=OneWay}`,IsChecked:`True`,Tag:`VerticalStackLayout`}),l(i.RadioButton,{Content:`{x:Bind stackLayoutHorizontalLabel, Mode=OneWay}`,Tag:`HorizontalStackLayout`}),l(i.RadioButton,{Content:`{x:Bind uniformGridLayoutLabel, Mode=OneWay}`,Tag:`UniformGridLayout`})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind basicOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),l(i.ControlExample,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind virtualizingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind virtualizingXaml, Mode=OneWay}`,CSharp:`{x:Bind virtualizingCSharp, Mode=OneWay}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.ItemsRepeaterScrollHost,null,{default:e(()=>[l(i.ScrollViewer,{Height:`400`,Padding:`0,0,16,0`,IsVerticalScrollChainingEnabled:`False`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(i.ItemsRepeater,{Margin:`0,0,12,0`,HorizontalAlignment:`Stretch`,ItemsSource:`{x:Bind numbers, Mode=OneWay}`,ItemTemplate:`{x:Bind virtualizingTemplate, Mode=OneWay}`,Layout:`{x:Bind virtualizingLayout, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Options,null,{default:e(()=>[l(i.StackPanel,{Spacing:`12`},{default:e(()=>[l(i.RadioButtons,{SelectedIndex:`1`,SelectionChanged:`LayoutBtn_SelectionChanged`},{default:e(()=>[l(i.RadioButton,{Content:`{x:Bind uniformGridOptionLabel, Mode=OneWay}`,Tag:`UniformGridLayout2`}),l(i.RadioButton,{Content:`{x:Bind customVirtualizingLayoutLabel, Mode=OneWay}`,Tag:`MyFeedLayout`})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind virtualizingOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),l(i.ControlExample,{HeaderText:`{x:Bind mixedHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind mixedXaml, Mode=OneWay}`,CSharp:`{x:Bind mixedCSharp, Mode=OneWay}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.StackPanel,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind mixedNote, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(i.ItemsRepeater,{"x:Name":`MixedTypeRepeater`,Margin:`0,0,12,0`,HorizontalAlignment:`Stretch`,ItemsSource:`{x:Bind mixedItems, Mode=OneWay}`,ItemTemplate:`{StaticResource StringOrIntTemplateSelector}`},{default:e(()=>[l(i.ItemsRepeater.Layout,null,{default:e(()=>[l(i.UniformGridLayout,{MinItemHeight:`200`,MinItemWidth:`200`})]),_:1})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind mixedOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),l(i.ControlExample.Options)]),_:1}),l(i.ControlExample,{HeaderText:`{x:Bind nestedHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind nestedXaml, Mode=OneWay}`,CSharp:`{x:Bind nestedCSharp, Mode=OneWay}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.ScrollViewer,{HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(i.ItemsRepeater,{VerticalAlignment:`Top`,ItemsSource:`{x:Bind categories, Mode=OneWay}`,ItemTemplate:`{StaticResource CategoryTemplate}`},{default:e(()=>[l(i.ItemsRepeater.Layout,null,{default:e(()=>[l(i.StackLayout,{Orientation:`Vertical`})]),_:1})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind nestedOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),l(i.ControlExample.Options)]),_:1}),l(i.ControlExample,{HeaderText:`{x:Bind animatedHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind animatedXaml, Mode=OneWay}`,CSharp:`{x:Bind animatedCSharp, Mode=OneWay}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.Grid,{class:`animated-example`},{default:e(()=>[l(i.Grid.ColumnDefinitions,null,{default:e(()=>[l(i.ColumnDefinition,{Width:`1*`}),l(i.ColumnDefinition,{Width:`1*`})]),_:1}),l(i.ScrollViewer,{"x:Name":`Animated_ScrollViewer`,"Grid.Column":`0`,Width:`250`,Height:`175`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`,ViewChanged:`Animated_ScrollViewer_ViewChanged`},{default:e(()=>[l(i.ItemsRepeater,{"x:Name":`animatedScrollRepeater`,ItemsSource:`{x:Bind colorItems, Mode=OneWay}`,ElementPrepared:`OnElementPrepared`,ElementClearing:`OnElementClearing`,GettingFocus:`OnAnimatedScrollRepeaterGettingFocus`,KeyDown:`OnAnimatedScrollRepeaterKeyDown`},{default:e(()=>[l(i.ItemsRepeater.ItemTemplate,null,{default:e(()=>[l(i.DataTemplate,null,{default:e(()=>[l(i.Button,{HorizontalAlignment:`Stretch`,Background:`{x:Bind Color}`,Foreground:`{ThemeResource TextFillColorInverseBrush}`,Content:`{x:Bind Name}`,Click:`OnAnimatedItemClicked`,GotFocus:`OnAnimatedItemGotFocus`})]),_:1})]),_:1})]),_:1})]),_:1}),l(i.Rectangle,{"x:Name":`colorRectangle`,"Grid.Column":`1`,Width:`150`,Height:`150`,Margin:`10,0,0,0`,"AutomationProperties.Name":`{x:Bind colorRectangleLabel}`,Stroke:`{ThemeResource SystemControlForegroundBaseHighBrush}`,Fill:`{x:Bind selectedColor, Mode=OneWay}`})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind selectedColorOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),l(i.ControlExample.Options)]),_:1}),l(i.ControlExample,{HeaderText:`{x:Bind heavyHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind heavyXaml, Mode=OneWay}`,CSharp:`{x:Bind heavyCSharp, Mode=OneWay}`},{default:e(()=>[l(i.ControlExample.Example,null,{default:e(()=>[l(i.Grid,{class:`recipes-example`,Height:`600`},{default:e(()=>[l(i.Grid.ColumnDefinitions,null,{default:e(()=>[l(i.ColumnDefinition,{Width:`1*`}),l(i.ColumnDefinition,{Width:`1*`})]),_:1}),l(i.ItemsRepeaterScrollHost,{"Grid.Column":`0`},{default:e(()=>[l(i.ScrollViewer,{VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(i.ItemsRepeater,{"x:Name":`VariedImageSizeRepeater`,ItemsSource:`{x:Bind visibleRecipes, Mode=OneWay}`,ItemTemplate:`{StaticResource RecipeTemplate}`},{default:e(()=>[l(i.ItemsRepeater.Layout,null,{default:e(()=>[l(i.VariedImageSizeLayout,{Width:`200`})]),_:1})]),_:1})]),_:1})]),_:1}),l(i.StackPanel,{"Grid.Column":`1`,Margin:`10,0,0,0`},{default:e(()=>[l(i.TextBox,{"x:Name":`FilterRecipes`,Width:`200`,Margin:`0,0,0,20`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,Header:`{x:Bind filterLabel, Mode=OneWay}`,Text:`{x:Bind recipeFilter, Mode=TwoWay}`,TextChanged:`FilterRecipes_FilterChanged`}),l(i.TextBlock,{Margin:`0,0,0,10`,Text:`{x:Bind sortLabel, Mode=OneWay}`}),l(i.Button,{Margin:`0,0,0,5`,Click:`OnSortAscClick`,Content:`{x:Bind leastToMostLabel, Mode=OneWay}`}),l(i.Button,{Click:`OnSortDesClick`,Content:`{x:Bind mostToLeastLabel, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),l(i.ControlExample.Output,null,{default:e(()=>[l(i.TextBlock,{Text:`{x:Bind filteredRecipesOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),l(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var v=a(g,[[`render`,_],[`__scopeId`,`data-v-9fd6efb7`],[`__file`,`ItemsRepeaterPage.vue`]]);export{v as default};