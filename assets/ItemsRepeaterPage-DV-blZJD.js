import{$i as e,Bi as t,Cn as n,En as r,Ht as i,Ji as a,Mn as ee,_i as o,bi as te,ci as s,dn as ne,gi as c,ki as l,ln as u,nn as d,o as f,p as re,t as p,ui as m,un as h,wi as ie}from"./ScrollViewer-DXAtwYnH.js";import{n as g}from"./ContentPresenter-CE6Vb4DE.js";import{t as _}from"./Button-1Ztf3pH0.js";import{s as v}from"./ItemsView-CNbp9FUM.js";import{t as ae}from"./TextBox-Ty-JbKyj.js";import{t as y}from"./StackPanel-DGz4UnE4.js";import{t as b}from"./ToggleButton-D0RGNdIP.js";import{t as x}from"./RadioButton-B9ORs7Zz.js";import{t as S}from"./RadioButtons-HTZK7a3T.js";import{t as C}from"./Ellipse-Jndv4x4f.js";import{t as w}from"./ControlExample-BX-yRpiQ.js";import{t as T}from"./Rectangle-A5mm8sV-.js";import{t as E}from"./ItemsRepeaterScrollHost-T2ra12vI.js";import{t as oe}from"./pageState-cPponcIo.js";import{t as D}from"./ItemsRepeater-DEvcWM6X.js";String.raw`public sealed partial class ItemsRepeaterPage : ItemsPageBase
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
}`,String.raw`public partial class MyDataTemplateSelector : DataTemplateSelector
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
}`,String.raw`<!-- XAML Code -->

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
</DataTemplate>`,String.raw`// C# code-behind

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
}`,String.raw`<!-- The nested ItemsRepeater experience is achieved by creating one ItemsRepeater (outerRepeater below)
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
</DataTemplate>`,String.raw`public class NestedCategory
{
    public string CategoryName { get; set; }
    public ObservableCollection<string> CategoryItems { get; set; }
    public NestedCategory(string catName, ObservableCollection<string> catItems)
    {
        CategoryName = catName;
        CategoryItems = catItems;
    }
}`,String.raw`<Grid>
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
</Grid>`,String.raw`private void OnAnimatedItemGotFocus(object sender, RoutedEventArgs e)
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
    }`,String.raw`<Grid Height="600">
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
        </DataTemplate>`,String.raw`// C# Code

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
}`;var O=425,se=`MyDataTemplateSelector`,k=ee({__name:`ItemsRepeaterPage`,setup(ee){let{t:k}=re(),ce=te(`currentPage`),{isFavoriteState:A,pageTheme:le,toggleTheme:ue,toggleFavorite:de}=oe(s(()=>ce?.value||`itemsrepeater`).value);s(()=>A.value?``:``),k(`text.itemsrepeater`),k(`text.itemsrepeater-description`),k(`sample.itemsrepeater.basic-non-interactive`),k(`sample.itemsrepeater.virtualizing-scrollable-list-items`),k(`sample.itemsrepeater.mixed-type-collection`),k(`sample.itemsrepeater.nested`),k(`sample.itemsrepeater.animated-scrolling-content-display`),k(`sample.itemsrepeater.virtualized-content-heavy-layout`),k(`sample.itemsrepeater.mixed-note`),k(`sample.add-item`),k(`sample.remove-item`),k(`sample.layout`);let j=k(`sample.itemsrepeater.stack-layout-vertical`),M=k(`sample.itemsrepeater.stack-layout-horizontal`),N=k(`sample.uniform-grid`),P=k(`sample.itemsrepeater.uniform-grid-option`),F=k(`sample.itemsrepeater.custom-virtualizing-layout`);k(`sample.filter-by-ingredient`),k(`sample.sort-by-number-of-ingredients`),k(`sample.least-to-most`),k(`sample.most-to-least`);let I=e=>({Length:e,MaxLength:O,Height:e/4,MaxHeight:O/4,Diameter:e/6,MaxDiameter:O/6}),L=a([I(300),I(25),I(175)]);s(()=>L.value.length>0);let R=a(`VerticalStackLayout`);s(()=>R.value===`HorizontalStackLayout`?6e3:R.value===`UniformGridLayout`?540:437),s(()=>`{StaticResource ${R.value}}`);let z=s(()=>R.value===`HorizontalStackLayout`?`VerticalBarTemplate`:R.value===`UniformGridLayout`?`CircularTemplate`:`HorizontalBarTemplate`);s(()=>`{StaticResource ${z.value}}`);let B=s(()=>({VerticalStackLayout:j,HorizontalStackLayout:M,UniformGridLayout:N})[R.value]);s(()=>k(`sample.itemsrepeater.items-layout-output`,{count:L.value.length,layout:B.value}));let V=a(Array.from({length:500},(e,t)=>t)),H=o({name:`MyDataTemplateSelector`,SelectTemplateCore:e=>Number(e)%2==0?`Normal`:`Accent`,setup:()=>()=>null}),U=a(`MyFeedLayout`);s(()=>`{StaticResource ${U.value}}`),s(()=>k(`sample.itemsrepeater.items-layout-output`,{count:V.value.length,layout:U.value===`MyFeedLayout`?F:P}));let W=a(`<common:ActivityFeedLayout x:Key="MyFeedLayout" ColumnSpacing="12"
                          RowSpacing="12" MinItemSize="80, 108"/>`),G=[64,k(`sample.itemsrepeater.mixed-text-1`),128,k(`sample.itemsrepeater.mixed-text-2`),256,k(`sample.itemsrepeater.mixed-text-3`),512,k(`sample.itemsrepeater.mixed-text-4`),1024],fe=o({name:`StringOrIntTemplateSelector`,SelectTemplateCore:e=>typeof e==`string`?`StringTemplate`:`IntTemplate`,setup:()=>()=>null});s(()=>k(`sample.itemsrepeater.mixed-output`,{integers:G.filter(e=>typeof e==`number`).length,strings:G.filter(e=>typeof e==`string`).length}));let K=Object.fromEntries(Object.entries({fruits:[`apricots`,`bananas`,`grapes`,`strawberries`,`watermelon`,`plums`,`blueberries`],vegetables:[`broccoli`,`spinach`,`sweet-potato`,`cauliflower`,`onion`,`brussels-sprouts`,`carrots`],grains:[`rice`,`quinoa`,`pasta`,`bread`,`farro`,`oats`,`barley`],proteins:[`steak`,`chicken`,`tofu`,`salmon`,`pork`,`chickpeas`,`eggs`]}).map(([e,t])=>[e,t.map(e=>k(`sample.itemsrepeater.food.${e}`))])),q=Object.entries(K).map(([e,t])=>({CategoryName:k(`sample.itemsrepeater.category.${e}`),CategoryItems:t}));s(()=>k(`sample.itemsrepeater.nested-output`,{categories:q.length,items:q.reduce((e,t)=>e+t.CategoryItems.length,0)}));let J=[`Blue`,`BlueViolet`,`Crimson`,`DarkCyan`,`DarkGoldenrod`,`DarkMagenta`,`DarkOliveGreen`,`DarkRed`,`DarkSlateBlue`,`DeepPink`,`IndianRed`,`MediumSlateBlue`,`Maroon`,`MidnightBlue`,`Peru`,`SaddleBrown`,`SteelBlue`,`OrangeRed`,`Firebrick`,`DarkKhaki`];a(``);let Y=a(``);J.map(e=>({Color:e,Name:k(`sample.itemsrepeater.color.${e}`)})),k(`sample.itemsrepeater.color-rectangle`),s(()=>Y.value?k(`sample.itemsrepeater.selected-color-output`,{color:Y.value}):k(`sample.itemsrepeater.no-color-selected`));let pe=new Set;ie(()=>pe.clear());let me=Object.values(K),he=[`garlic`,`lemon`,`butter`,`lime`,`feta-cheese`,`parmesan-cheese`,`breadcrumbs`].map(e=>k(`sample.itemsrepeater.food.${e}`)),X=e=>e[Math.floor(Math.random()*(e.length-1))],Z=(e=>Array.from({length:e},(e,t)=>{let n=me.map(e=>X(e)),r=Math.floor(Math.random()*4);for(let e=0;e<r;e+=1){let e=X(he);n.includes(e)||n.push(e)}return{Num:t,Name:k(`sample.itemsrepeater.recipe-name`,{number:t}),Color:X(J),IngList:n,Ingredients:`\n${n.join(`
`)}`}}))(1e3),ge=a(``),_e=a(!1),Q=a(!1),ve=s(()=>{let e=ge.value.toLowerCase(),t=e?Z.filter(t=>t.Ingredients.toLowerCase().includes(e)):Z;return Q.value?[...t].sort((e,t)=>_e.value?t.IngList.length-e.IngList.length:e.IngList.length-t.IngList.length):t});s(()=>k(`sample.itemsrepeater.filtered-recipes-output`,{count:ve.value.length}));let ye={VerticalStackLayout:`<StackLayout x:Name="VerticalStackLayout" Orientation="Vertical" Spacing="8"/>`,HorizontalStackLayout:`<StackLayout x:Name="HorizontalStackLayout" Orientation="Horizontal" Spacing="8"/>`,UniformGridLayout:`<UniformGridLayout x:Name="UniformGridLayout" MinRowSpacing="8" MinColumnSpacing="8"/>`},$={VerticalStackLayout:`<DataTemplate x:Key="HorizontalBarTemplate" x:DataType="l:Bar">
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
</DataTemplate>`};return s(()=>`<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer HorizontalScrollBarVisibility="Auto"
              HorizontalScrollMode="Auto"
              IsVerticalScrollChainingEnabled="False"
              MaxHeight="500">
    <ItemsRepeater x:Name="repeater"
               ItemsSource="{x:Bind BarItems}"
               Layout="{StaticResource ${R.value}}"
               ItemTemplate="{StaticResource ${z.value}}" />
</ScrollViewer>

<!-- The Layout specifications used: -->

${ye[R.value]}

<!-- The DataTemplate used: ${z.value}-->

${$[R.value]}`),s(()=>`<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer x:Name="scrollViewer"
                Height="400"
                IsVerticalScrollChainingEnabled="False"
                Padding="0,0,16,0">
    <ItemsRepeater
            ItemsSource="{x:Bind Numbers}"
            Layout="{StaticResource ${U.value}}"
            ItemTemplate="{StaticResource ${se}}" />
</ScrollViewer>

<!-- The Layout specifications used: -->

${W.value}

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
details about this custom layout. -->`),(a,ee)=>(l(),m(n,null,{default:t(()=>[c(n.Resources,null,{default:t(()=>[c(e(d),{"x:Key":`HorizontalBarTemplate`,"x:DataType":`local:Bar`},{default:t(()=>[c(g,{Width:`{x:Bind MaxLength}`,Background:`{ThemeResource SystemChromeLowColor}`},{default:t(()=>[c(T,{Width:`{x:Bind Length}`,Height:`24`,HorizontalAlignment:`Left`,Fill:`{ThemeResource SystemAccentColor}`})]),_:1})]),_:1}),c(e(d),{"x:Key":`VerticalBarTemplate`,"x:DataType":`local:Bar`},{default:t(()=>[c(g,{Height:`{x:Bind MaxHeight}`,Background:`{ThemeResource SystemChromeLowColor}`},{default:t(()=>[c(T,{Width:`48`,Height:`{x:Bind Height}`,VerticalAlignment:`Top`,Fill:`{ThemeResource SystemAccentColor}`})]),_:1})]),_:1}),c(e(d),{"x:Key":`CircularTemplate`,"x:DataType":`local:Bar`},{default:t(()=>[c(r,null,{default:t(()=>[c(C,{Width:`{x:Bind MaxDiameter}`,Height:`{x:Bind MaxDiameter}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Fill:`{ThemeResource SystemChromeLowColor}`}),c(C,{Width:`{x:Bind Diameter}`,Height:`{x:Bind Diameter}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Fill:`{ThemeResource SystemAccentColor}`})]),_:1})]),_:1}),c(e(u),{"x:Name":`VerticalStackLayout`,Orientation:`Vertical`,Spacing:`8`}),c(e(u),{"x:Name":`HorizontalStackLayout`,Orientation:`Horizontal`,Spacing:`8`}),c(e(h),{"x:Name":`UniformGridLayout`,MinRowSpacing:`8`,MinColumnSpacing:`8`}),c(e(d),{"x:Key":`NormalItemTemplate`,"x:DataType":`x:Int32`},{default:t(()=>[c(g,{Background:`{ThemeResource SystemControlBackgroundChromeMediumBrush}`},{default:t(()=>[c(f,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Text:`{x:Bind}`})]),_:1})]),_:1}),c(e(d),{"x:Key":`AccentItemTemplate`,"x:DataType":`x:Int32`},{default:t(()=>[c(g,{Background:`{ThemeResource SystemControlBackgroundAccentBrush}`},{default:t(()=>[c(f,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,Foreground:`{ThemeResource SystemControlForegroundChromeWhiteBrush}`,Text:`{x:Bind}`})]),_:1})]),_:1}),c(e(h),{"x:Key":`UniformGridLayout2`,MinItemWidth:`108`,MinItemHeight:`108`,MinRowSpacing:`12`,MinColumnSpacing:`12`}),c(e(i),{"x:Key":`MyFeedLayout`,ColumnSpacing:`12`,RowSpacing:`12`,MinItemSize:`80, 108`}),c(e(H),{"x:Key":`MyDataTemplateSelector`,Normal:`{StaticResource NormalItemTemplate}`,Accent:`{StaticResource AccentItemTemplate}`}),c(e(fe),{"x:Key":`StringOrIntTemplateSelector`,StringTemplate:`{StaticResource StringDataTemplate}`,IntTemplate:`{StaticResource IntDataTemplate}`}),c(e(d),{"x:Key":`StringDataTemplate`,"x:DataType":`x:String`},{default:t(()=>[c(r,{Margin:`10`,Background:`{ThemeResource SystemControlBackgroundAccentBrush}`},{default:t(()=>[c(f,{Padding:`10`,Text:`{x:Bind}`,Foreground:`{ThemeResource SystemControlForegroundChromeWhiteBrush}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(e(d),{"x:Key":`IntDataTemplate`,"x:DataType":`x:Int32`},{default:t(()=>[c(r,{Margin:`10`,Background:`{ThemeResource SystemControlBackgroundChromeMediumBrush}`},{default:t(()=>[c(f,{Padding:`10`,Text:`{x:Bind}`,Style:`{StaticResource HeaderTextBlockStyle}`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`})]),_:1})]),_:1}),c(e(d),{"x:Key":`CategoryTemplate`,"x:DataType":`local:NestedCategory`},{default:t(()=>[c(y,null,{default:t(()=>[c(f,{Padding:`8`,Text:`{x:Bind CategoryName}`,Style:`{StaticResource TitleTextBlockStyle}`}),c(D,{"x:Name":`innerRepeater`,ItemsSource:`{x:Bind CategoryItems}`,ItemTemplate:`{StaticResource StringDataTemplate}`},{default:t(()=>[c(D.Layout,null,{default:t(()=>[c(e(u),{Orientation:`Horizontal`})]),_:1})]),_:1})]),_:1})]),_:1}),c(e(d),{"x:Key":`RecipeTemplate`,"x:DataType":`local:Recipe`},{default:t(()=>[c(y,{Margin:`5`,Background:`{ThemeResource SystemControlBackgroundBaseLowBrush}`,BorderThickness:`1`},{default:t(()=>[c(y,{Height:`75`,Margin:`8`,Opacity:`.8`,Background:`{x:Bind Color}`},{default:t(()=>[c(f,{Padding:`12`,Text:`{x:Bind Num.ToString()}`,FontSize:`35`,TextAlignment:`Center`,Foreground:`{ThemeResource SystemControlForegroundAltHighBrush}`})]),_:1}),c(f,{Margin:`15,0,10,0`,Text:`{x:Bind Name}`,Style:`{StaticResource TitleTextBlockStyle}`,TextWrapping:`Wrap`}),c(f,{Margin:`15,0,15,15`,Text:`{x:Bind Ingredients}`,Style:`{StaticResource BodyTextBlockStyle}`})]),_:1})]),_:1})]),_:1}),c(p,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[c(y,{class:`gallery-item-page`},{default:t(()=>[c(y,{class:`page-heading`},{default:t(()=>[c(f,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),c(f,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(y,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[c(_,{class:`header-action`,Click:`toggleTheme`},{default:t(()=>[c(f,{class:`icon`,Text:``})]),_:1}),c(b,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`},{default:t(()=>[c(f,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(y,{class:`gallery-page-content`},{default:t(()=>[c(w,{HeaderText:`{x:Bind basicHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind basicXaml, Mode=OneWay}`,CSharp:`{x:Bind basicCSharp, Mode=OneWay}`},{default:t(()=>[c(w.Example,null,{default:t(()=>[c(p,{MaxHeight:`500`,HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,IsVerticalScrollChainingEnabled:`False`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[c(D,{MaxWidth:`{x:Bind basicRepeaterMaxWidth, Mode=OneWay}`,ItemsSource:`{x:Bind barItems, Mode=OneWay}`,ItemTemplate:`{x:Bind basicTemplate, Mode=OneWay}`,Layout:`{x:Bind basicLayout, Mode=OneWay}`})]),_:1})]),_:1}),c(w.Options,null,{default:t(()=>[c(y,{Spacing:`12`},{default:t(()=>[c(_,{MinWidth:`150`,Click:`AddBtn_Click`,Content:`{x:Bind addItemLabel, Mode=OneWay}`}),c(_,{MinWidth:`150`,Click:`DeleteBtn_Click`,IsEnabled:`{x:Bind canDeleteBar, Mode=OneWay}`,Content:`{x:Bind removeItemLabel, Mode=OneWay}`}),c(S,{Header:`{x:Bind layoutLabel, Mode=OneWay}`,SelectionChanged:`RadioBtn_Click`},{default:t(()=>[c(x,{Content:`{x:Bind stackLayoutVerticalLabel, Mode=OneWay}`,IsChecked:`True`,Tag:`VerticalStackLayout`}),c(x,{Content:`{x:Bind stackLayoutHorizontalLabel, Mode=OneWay}`,Tag:`HorizontalStackLayout`}),c(x,{Content:`{x:Bind uniformGridLayoutLabel, Mode=OneWay}`,Tag:`UniformGridLayout`})]),_:1})]),_:1})]),_:1}),c(w.Output,null,{default:t(()=>[c(f,{Text:`{x:Bind basicOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(w,{HorizontalContentAlignment:`Stretch`,HeaderText:`{x:Bind virtualizingHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind virtualizingXaml, Mode=OneWay}`,CSharp:`{x:Bind virtualizingCSharp, Mode=OneWay}`},{default:t(()=>[c(w.Example,null,{default:t(()=>[c(E,null,{default:t(()=>[c(p,{Height:`400`,Padding:`0,0,16,0`,IsVerticalScrollChainingEnabled:`False`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[c(D,{Margin:`0,0,12,0`,HorizontalAlignment:`Stretch`,ItemsSource:`{x:Bind numbers, Mode=OneWay}`,ItemTemplate:`{x:Bind virtualizingTemplate, Mode=OneWay}`,Layout:`{x:Bind virtualizingLayout, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(w.Options,null,{default:t(()=>[c(y,{Spacing:`12`},{default:t(()=>[c(S,{SelectedIndex:`1`,SelectionChanged:`LayoutBtn_SelectionChanged`},{default:t(()=>[c(x,{Content:`{x:Bind uniformGridOptionLabel, Mode=OneWay}`,Tag:`UniformGridLayout2`}),c(x,{Content:`{x:Bind customVirtualizingLayoutLabel, Mode=OneWay}`,Tag:`MyFeedLayout`})]),_:1})]),_:1})]),_:1}),c(w.Output,null,{default:t(()=>[c(f,{Text:`{x:Bind virtualizingOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1})]),_:1}),c(w,{HeaderText:`{x:Bind mixedHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind mixedXaml, Mode=OneWay}`,CSharp:`{x:Bind mixedCSharp, Mode=OneWay}`},{default:t(()=>[c(w.Example,null,{default:t(()=>[c(y,null,{default:t(()=>[c(f,{Text:`{x:Bind mixedNote, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(D,{"x:Name":`MixedTypeRepeater`,Margin:`0,0,12,0`,HorizontalAlignment:`Stretch`,ItemsSource:`{x:Bind mixedItems, Mode=OneWay}`,ItemTemplate:`{StaticResource StringOrIntTemplateSelector}`},{default:t(()=>[c(D.Layout,null,{default:t(()=>[c(e(h),{MinItemHeight:`200`,MinItemWidth:`200`})]),_:1})]),_:1})]),_:1})]),_:1}),c(w.Output,null,{default:t(()=>[c(f,{Text:`{x:Bind mixedOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),c(w.Options)]),_:1}),c(w,{HeaderText:`{x:Bind nestedHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind nestedXaml, Mode=OneWay}`,CSharp:`{x:Bind nestedCSharp, Mode=OneWay}`},{default:t(()=>[c(w.Example,null,{default:t(()=>[c(p,{HorizontalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Auto`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[c(D,{VerticalAlignment:`Top`,ItemsSource:`{x:Bind categories, Mode=OneWay}`,ItemTemplate:`{StaticResource CategoryTemplate}`},{default:t(()=>[c(D.Layout,null,{default:t(()=>[c(e(u),{Orientation:`Vertical`})]),_:1})]),_:1})]),_:1})]),_:1}),c(w.Output,null,{default:t(()=>[c(f,{Text:`{x:Bind nestedOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),c(w.Options)]),_:1}),c(w,{HeaderText:`{x:Bind animatedHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind animatedXaml, Mode=OneWay}`,CSharp:`{x:Bind animatedCSharp, Mode=OneWay}`},{default:t(()=>[c(w.Example,null,{default:t(()=>[c(r,{class:`animated-example`},{default:t(()=>[c(r.ColumnDefinitions,null,{default:t(()=>[c(v,{Width:`1*`}),c(v,{Width:`1*`})]),_:1}),c(p,{"x:Name":`Animated_ScrollViewer`,"Grid.Column":`0`,Width:`250`,Height:`175`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`,ViewChanged:`Animated_ScrollViewer_ViewChanged`},{default:t(()=>[c(D,{"x:Name":`animatedScrollRepeater`,ItemsSource:`{x:Bind colorItems, Mode=OneWay}`,ElementPrepared:`OnElementPrepared`,ElementClearing:`OnElementClearing`,GettingFocus:`OnAnimatedScrollRepeaterGettingFocus`,KeyDown:`OnAnimatedScrollRepeaterKeyDown`},{default:t(()=>[c(D.ItemTemplate,null,{default:t(()=>[c(e(d),null,{default:t(()=>[c(_,{HorizontalAlignment:`Stretch`,Background:`{x:Bind Color}`,Foreground:`{ThemeResource TextFillColorInverseBrush}`,Content:`{x:Bind Name}`,Click:`OnAnimatedItemClicked`,GotFocus:`OnAnimatedItemGotFocus`})]),_:1})]),_:1})]),_:1})]),_:1}),c(T,{"x:Name":`colorRectangle`,"Grid.Column":`1`,Width:`150`,Height:`150`,Margin:`10,0,0,0`,"AutomationProperties.Name":`{x:Bind colorRectangleLabel}`,Stroke:`{ThemeResource SystemControlForegroundBaseHighBrush}`,Fill:`{x:Bind selectedColor, Mode=OneWay}`})]),_:1})]),_:1}),c(w.Output,null,{default:t(()=>[c(f,{Text:`{x:Bind selectedColorOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),c(w.Options)]),_:1}),c(w,{HeaderText:`{x:Bind heavyHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind heavyXaml, Mode=OneWay}`,CSharp:`{x:Bind heavyCSharp, Mode=OneWay}`},{default:t(()=>[c(w.Example,null,{default:t(()=>[c(r,{class:`recipes-example`,Height:`600`},{default:t(()=>[c(r.ColumnDefinitions,null,{default:t(()=>[c(v,{Width:`1*`}),c(v,{Width:`1*`})]),_:1}),c(E,{"Grid.Column":`0`},{default:t(()=>[c(p,{VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[c(D,{"x:Name":`VariedImageSizeRepeater`,ItemsSource:`{x:Bind visibleRecipes, Mode=OneWay}`,ItemTemplate:`{StaticResource RecipeTemplate}`},{default:t(()=>[c(D.Layout,null,{default:t(()=>[c(e(ne),{Width:`200`})]),_:1})]),_:1})]),_:1})]),_:1}),c(y,{"Grid.Column":`1`,Margin:`10,0,0,0`},{default:t(()=>[c(ae,{"x:Name":`FilterRecipes`,Width:`200`,Margin:`0,0,0,20`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,Header:`{x:Bind filterLabel, Mode=OneWay}`,Text:`{x:Bind recipeFilter, Mode=TwoWay}`,TextChanged:`FilterRecipes_FilterChanged`}),c(f,{Margin:`0,0,0,10`,Text:`{x:Bind sortLabel, Mode=OneWay}`}),c(_,{Margin:`0,0,0,5`,Click:`OnSortAscClick`,Content:`{x:Bind leastToMostLabel, Mode=OneWay}`}),c(_,{Click:`OnSortDesClick`,Content:`{x:Bind mostToLeastLabel, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(w.Output,null,{default:t(()=>[c(f,{Text:`{x:Bind filteredRecipesOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),c(w.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-9fd6efb7`]]);export{k as default};