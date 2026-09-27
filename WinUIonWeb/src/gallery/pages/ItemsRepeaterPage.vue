<template>
  <Page>
    <Page.Resources>
      <DataTemplate x:Key="HorizontalBarTemplate" x:DataType="local:Bar">
        <Border Width="{x:Bind MaxLength}" Background="{ThemeResource SystemChromeLowColor}">
          <Rectangle Width="{x:Bind Length}" Height="24" HorizontalAlignment="Left" Fill="{ThemeResource SystemAccentColor}" />
        </Border>
      </DataTemplate>
      <DataTemplate x:Key="VerticalBarTemplate" x:DataType="local:Bar">
        <Border Height="{x:Bind MaxHeight}" Background="{ThemeResource SystemChromeLowColor}">
          <Rectangle Width="48" Height="{x:Bind Height}" VerticalAlignment="Top" Fill="{ThemeResource SystemAccentColor}" />
        </Border>
      </DataTemplate>
      <DataTemplate x:Key="CircularTemplate" x:DataType="local:Bar">
        <Grid>
          <Ellipse Width="{x:Bind MaxDiameter}" Height="{x:Bind MaxDiameter}" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="{ThemeResource SystemChromeLowColor}" />
          <Ellipse Width="{x:Bind Diameter}" Height="{x:Bind Diameter}" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="{ThemeResource SystemAccentColor}" />
        </Grid>
      </DataTemplate>

      <StackLayout x:Name="VerticalStackLayout" Orientation="Vertical" Spacing="8" />
      <StackLayout x:Name="HorizontalStackLayout" Orientation="Horizontal" Spacing="8" />
      <UniformGridLayout x:Name="UniformGridLayout" MinRowSpacing="8" MinColumnSpacing="8" />

      <DataTemplate x:Key="NormalItemTemplate" x:DataType="x:Int32">
        <Border Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}">
          <TextBlock HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind}" />
        </Border>
      </DataTemplate>
      <DataTemplate x:Key="AccentItemTemplate" x:DataType="x:Int32">
        <Border Background="{ThemeResource SystemControlBackgroundAccentBrush}">
          <TextBlock HorizontalAlignment="Center" VerticalAlignment="Center" Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}" Text="{x:Bind}" />
        </Border>
      </DataTemplate>
      <UniformGridLayout x:Key="UniformGridLayout2" MinItemWidth="108" MinItemHeight="108" MinRowSpacing="12" MinColumnSpacing="12" />
      <ActivityFeedLayout x:Key="MyFeedLayout" ColumnSpacing="12" RowSpacing="12" MinItemSize="80, 108" />

      <!-- DataTemplateSelector declarations. The selector decides which branch
           an item uses; these nodes name the branches, exactly as XAML does. -->
      <MyDataTemplateSelector x:Key="MyDataTemplateSelector" Normal="{StaticResource NormalItemTemplate}" Accent="{StaticResource AccentItemTemplate}" />
      <StringOrIntTemplateSelector x:Key="StringOrIntTemplateSelector" StringTemplate="{StaticResource StringDataTemplate}" IntTemplate="{StaticResource IntDataTemplate}" />

      <DataTemplate x:Key="StringDataTemplate" x:DataType="x:String">
        <Grid Margin="10" Background="{ThemeResource SystemControlBackgroundAccentBrush}">
          <TextBlock Padding="10" Text="{x:Bind}" Foreground="{ThemeResource SystemControlForegroundChromeWhiteBrush}" HorizontalAlignment="Center" VerticalAlignment="Center" TextWrapping="Wrap" />
        </Grid>
      </DataTemplate>
      <DataTemplate x:Key="IntDataTemplate" x:DataType="x:Int32">
        <Grid Margin="10" Background="{ThemeResource SystemControlBackgroundChromeMediumBrush}">
          <TextBlock Padding="10" Text="{x:Bind}" Style="{StaticResource HeaderTextBlockStyle}" HorizontalAlignment="Center" VerticalAlignment="Center" />
        </Grid>
      </DataTemplate>

      <DataTemplate x:Key="CategoryTemplate" x:DataType="local:NestedCategory">
        <StackPanel>
          <TextBlock Padding="8" Text="{x:Bind CategoryName}" Style="{StaticResource TitleTextBlockStyle}" />
          <ItemsRepeater x:Name="innerRepeater" ItemsSource="{x:Bind CategoryItems}" ItemTemplate="{StaticResource StringDataTemplate}">
            <ItemsRepeater.Layout>
              <StackLayout Orientation="Horizontal" />
            </ItemsRepeater.Layout>
          </ItemsRepeater>
        </StackPanel>
      </DataTemplate>

      <DataTemplate x:Key="RecipeTemplate" x:DataType="local:Recipe">
        <StackPanel Margin="5" Background="{ThemeResource SystemControlBackgroundBaseLowBrush}" BorderThickness="1">
          <StackPanel Height="75" Margin="8" Opacity=".8" Background="{x:Bind Color}">
            <TextBlock Padding="12" Text="{x:Bind Num.ToString()}" FontSize="35" TextAlignment="Center" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" />
          </StackPanel>
          <TextBlock Margin="15,0,10,0" Text="{x:Bind Name}" Style="{StaticResource TitleTextBlockStyle}" TextWrapping="Wrap" />
          <TextBlock Margin="15,0,15,15" Text="{x:Bind Ingredients}" Style="{StaticResource BodyTextBlockStyle}" />
        </StackPanel>
      </DataTemplate>
    </Page.Resources>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <!-- 1. Basic, non-interactive items laid out by ItemsRepeater -->
          <ControlExample HeaderText="{x:Bind basicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}" CSharp="{x:Bind basicCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <ScrollViewer MaxHeight="500" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" IsVerticalScrollChainingEnabled="False" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
                <ItemsRepeater MaxWidth="{x:Bind basicRepeaterMaxWidth, Mode=OneWay}" ItemsSource="{x:Bind barItems, Mode=OneWay}" ItemTemplate="{x:Bind basicTemplate, Mode=OneWay}" Layout="{x:Bind basicLayout, Mode=OneWay}" />
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Options>
              <StackPanel Spacing="12">
                <Button MinWidth="150" Click="AddBtn_Click" Content="{x:Bind addItemLabel, Mode=OneWay}" />
                <Button MinWidth="150" Click="DeleteBtn_Click" IsEnabled="{x:Bind canDeleteBar, Mode=OneWay}" Content="{x:Bind removeItemLabel, Mode=OneWay}" />
                <RadioButtons Header="{x:Bind layoutLabel, Mode=OneWay}" SelectionChanged="RadioBtn_Click">
                  <RadioButton Content="{x:Bind stackLayoutVerticalLabel, Mode=OneWay}" IsChecked="True" Tag="VerticalStackLayout" />
                  <RadioButton Content="{x:Bind stackLayoutHorizontalLabel, Mode=OneWay}" Tag="HorizontalStackLayout" />
                  <RadioButton Content="{x:Bind uniformGridLayoutLabel, Mode=OneWay}" Tag="UniformGridLayout" />
                </RadioButtons>
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind basicOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
          </ControlExample>

          <!-- 2. Virtualizing, scrollable list of items laid out by ItemsRepeater -->
          <ControlExample HorizontalContentAlignment="Stretch" HeaderText="{x:Bind virtualizingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind virtualizingXaml, Mode=OneWay}" CSharp="{x:Bind virtualizingCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <ItemsRepeaterScrollHost>
                <ScrollViewer Height="400" Padding="0,0,16,0" IsVerticalScrollChainingEnabled="False" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
                  <ItemsRepeater Margin="0,0,12,0" HorizontalAlignment="Stretch" ItemsSource="{x:Bind numbers, Mode=OneWay}" ItemTemplate="{x:Bind virtualizingTemplate, Mode=OneWay}" Layout="{x:Bind virtualizingLayout, Mode=OneWay}" />
                </ScrollViewer>
              </ItemsRepeaterScrollHost>
            </ControlExample.Example>
            <ControlExample.Options>
              <StackPanel Spacing="12">
                <RadioButtons SelectedIndex="1" SelectionChanged="LayoutBtn_SelectionChanged">
                  <RadioButton Content="{x:Bind uniformGridOptionLabel, Mode=OneWay}" Tag="UniformGridLayout2" />
                  <RadioButton Content="{x:Bind customVirtualizingLayoutLabel, Mode=OneWay}" Tag="MyFeedLayout" />
                </RadioButtons>
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind virtualizingOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
          </ControlExample>

          <!-- 3. ItemsRepeater with mixed-type collection -->
          <ControlExample HeaderText="{x:Bind mixedHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind mixedXaml, Mode=OneWay}" CSharp="{x:Bind mixedCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel>
                <TextBlock Text="{x:Bind mixedNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <ItemsRepeater x:Name="MixedTypeRepeater" Margin="0,0,12,0" HorizontalAlignment="Stretch" ItemsSource="{x:Bind mixedItems, Mode=OneWay}" ItemTemplate="{StaticResource StringOrIntTemplateSelector}">
                  <ItemsRepeater.Layout>
                    <UniformGridLayout MinItemHeight="200" MinItemWidth="200" />
                  </ItemsRepeater.Layout>
                </ItemsRepeater>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind mixedOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <!-- 4. Laying out nested ItemsRepeaters -->
          <ControlExample HeaderText="{x:Bind nestedHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind nestedXaml, Mode=OneWay}" CSharp="{x:Bind nestedCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <ScrollViewer HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
                <ItemsRepeater VerticalAlignment="Top" ItemsSource="{x:Bind categories, Mode=OneWay}" ItemTemplate="{StaticResource CategoryTemplate}">
                  <ItemsRepeater.Layout>
                    <StackLayout Orientation="Vertical" />
                  </ItemsRepeater.Layout>
                </ItemsRepeater>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind nestedOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <!-- 5. Animated Scrolling and Content Display -->
          <ControlExample HeaderText="{x:Bind animatedHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind animatedXaml, Mode=OneWay}" CSharp="{x:Bind animatedCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="animated-example">
                <Grid.ColumnDefinitions>
                  <ColumnDefinition Width="1*" />
                  <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>
                <ScrollViewer x:Name="Animated_ScrollViewer" Grid.Column="0" Width="250" Height="175" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto" ViewChanged="Animated_ScrollViewer_ViewChanged">
                  <ItemsRepeater x:Name="animatedScrollRepeater" ItemsSource="{x:Bind colorItems, Mode=OneWay}" ElementPrepared="OnElementPrepared" ElementClearing="OnElementClearing" GettingFocus="OnAnimatedScrollRepeaterGettingFocus" KeyDown="OnAnimatedScrollRepeaterKeyDown">
                    <ItemsRepeater.ItemTemplate>
                      <DataTemplate>
                        <Button HorizontalAlignment="Stretch" Background="{x:Bind Color}" Foreground="{ThemeResource TextFillColorInverseBrush}" Content="{x:Bind Name}" Click="OnAnimatedItemClicked" GotFocus="OnAnimatedItemGotFocus" />
                      </DataTemplate>
                    </ItemsRepeater.ItemTemplate>
                  </ItemsRepeater>
                </ScrollViewer>
                <Rectangle x:Name="colorRectangle" Grid.Column="1" Width="150" Height="150" Margin="10,0,0,0" AutomationProperties.Name="{x:Bind colorRectangleLabel}" Stroke="{ThemeResource SystemControlForegroundBaseHighBrush}" Fill="{x:Bind selectedColor, Mode=OneWay}" />
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind selectedColorOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>

          <!-- 6. Virtualized, Content-Heavy Layout with Filtering and Sorting -->
          <ControlExample HeaderText="{x:Bind heavyHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind heavyXaml, Mode=OneWay}" CSharp="{x:Bind heavyCSharp, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="recipes-example" Height="600">
                <Grid.ColumnDefinitions>
                  <ColumnDefinition Width="1*" />
                  <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>
                <ItemsRepeaterScrollHost Grid.Column="0">
                  <ScrollViewer VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
                    <ItemsRepeater x:Name="VariedImageSizeRepeater" ItemsSource="{x:Bind visibleRecipes, Mode=OneWay}" ItemTemplate="{StaticResource RecipeTemplate}">
                      <ItemsRepeater.Layout>
                        <VariedImageSizeLayout Width="200" />
                      </ItemsRepeater.Layout>
                    </ItemsRepeater>
                  </ScrollViewer>
                </ItemsRepeaterScrollHost>
                <StackPanel Grid.Column="1" Margin="10,0,0,0">
                  <TextBox x:Name="FilterRecipes" Width="200" Margin="0,0,0,20" HorizontalAlignment="Left" VerticalAlignment="Top" Header="{x:Bind filterLabel, Mode=OneWay}" Text="{x:Bind recipeFilter, Mode=TwoWay}" TextChanged="FilterRecipes_FilterChanged" />
                  <TextBlock Margin="0,0,0,10" Text="{x:Bind sortLabel, Mode=OneWay}" />
                  <Button Margin="0,0,0,5" Click="OnSortAscClick" Content="{x:Bind leastToMostLabel, Mode=OneWay}" />
                  <Button Click="OnSortDesClick" Content="{x:Bind mostToLeastLabel, Mode=OneWay}" />
                </StackPanel>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output>
              <TextBlock Text="{x:Bind filteredRecipesOutput, Mode=OneWay}" TextWrapping="Wrap" />
            </ControlExample.Output>
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
// @ts-nocheck The public XAML property casing is intentionally preserved.
import { computed, defineComponent, inject, onBeforeUnmount, ref } from 'vue'
import { basicCSharp, virtualizingCSharp, mixedXaml, mixedCSharp, nestedXaml, nestedCSharp, animatedXaml, animatedCSharp, heavyXaml, heavyCSharp } from '../samples/ItemsRepeaterSamples'
import Border from '../../components/Border.vue'
import Ellipse from '../../components/Ellipse.vue'
import { ActivityFeedLayout, DataTemplate, StackLayout, UniformGridLayout, VariedImageSizeLayout } from '../../components/CollectionProperties'
import Button from '../../components/Button.vue'
import ColumnDefinition from '../../components/ColumnDefinition.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ItemsRepeater from '../../components/ItemsRepeater.vue'
import ItemsRepeaterScrollHost from '../../components/ItemsRepeaterScrollHost.vue'
import Page from '../../components/Page.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import RadioButton from '../../components/RadioButton.vue'
import Rectangle from '../../components/Rectangle.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import TextBox from '../../components/TextBox.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'itemsrepeater')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '' : '')

const pageTitle = t('text.itemsrepeater')
const pageDescription = t('text.itemsrepeater-description')
const basicHeader = t('sample.itemsrepeater.basic-non-interactive')
const virtualizingHeader = t('sample.itemsrepeater.virtualizing-scrollable-list-items')
const mixedHeader = t('sample.itemsrepeater.mixed-type-collection')
const nestedHeader = t('sample.itemsrepeater.nested')
const animatedHeader = t('sample.itemsrepeater.animated-scrolling-content-display')
const heavyHeader = t('sample.itemsrepeater.virtualized-content-heavy-layout')
const mixedNote = t('sample.itemsrepeater.mixed-note')
const addItemLabel = t('sample.add-item')
const removeItemLabel = t('sample.remove-item')
const layoutLabel = t('sample.layout')
const stackLayoutVerticalLabel = t('sample.itemsrepeater.stack-layout-vertical')
const stackLayoutHorizontalLabel = t('sample.itemsrepeater.stack-layout-horizontal')
const uniformGridLayoutLabel = t('sample.uniform-grid')
const uniformGridOptionLabel = t('sample.itemsrepeater.uniform-grid-option')
const customVirtualizingLayoutLabel = t('sample.itemsrepeater.custom-virtualizing-layout')
const filterLabel = t('sample.filter-by-ingredient')
const sortLabel = t('sample.sort-by-number-of-ingredients')
const leastToMostLabel = t('sample.least-to-most')
const mostToLeastLabel = t('sample.most-to-least')

/* ------------------------------------------------------------------ *
 * Example 1: Basic, non-interactive items
 * ------------------------------------------------------------------ */

const maxLength = 425
const makeBar = (length) => ({
  Length: length,
  MaxLength: maxLength,
  Height: length / 4,
  MaxHeight: maxLength / 4,
  Diameter: length / 6,
  MaxDiameter: maxLength / 6
})
const barItems = ref([makeBar(300), makeBar(25), makeBar(175)])
const canDeleteBar = computed(() => barItems.value.length > 0)
const AddBtn_Click = () => { barItems.value.push(makeBar(Math.floor(Math.random() * maxLength))) }
const DeleteBtn_Click = () => { if (barItems.value.length) barItems.value.shift() }

const basicLayoutKey = ref('VerticalStackLayout')
// repeater.MaxWidth per layout: MaxLength + 12 for the vertical bars, 6000 to
// let the horizontal stack scroll, and 540 for the circular grid.
const basicRepeaterMaxWidth = computed(() => basicLayoutKey.value === 'HorizontalStackLayout'
  ? 6000
  : basicLayoutKey.value === 'UniformGridLayout' ? 540 : maxLength + 12)
// Layout="{StaticResource ...}" and ItemTemplate="{StaticResource ...}" name
// the keyed objects in Page.Resources, exactly like the official sample.
const basicLayout = computed(() => `{StaticResource ${basicLayoutKey.value}}`)
const basicTemplateKey = computed(() => basicLayoutKey.value === 'HorizontalStackLayout'
  ? 'VerticalBarTemplate'
  : basicLayoutKey.value === 'UniformGridLayout' ? 'CircularTemplate' : 'HorizontalBarTemplate')
const basicTemplate = computed(() => `{StaticResource ${basicTemplateKey.value}}`)
const basicLayoutLabel = computed(() => ({
  VerticalStackLayout: stackLayoutVerticalLabel,
  HorizontalStackLayout: stackLayoutHorizontalLabel,
  UniformGridLayout: uniformGridLayoutLabel
})[basicLayoutKey.value])
const basicOutput = computed(() => t('sample.itemsrepeater.items-layout-output', { count: barItems.value.length, layout: basicLayoutLabel.value }))

const RadioBtn_Click = (args) => {
  const layoutKey = args?.SelectedItem?.Tag
  if (typeof layoutKey !== 'string' || !(layoutKey in sampleCodeLayouts)) return
  basicLayoutKey.value = layoutKey
}

/* ------------------------------------------------------------------ *
 * Example 2: Virtualizing, scrollable list of items
 * ------------------------------------------------------------------ */

const numbers = ref(Array.from({ length: 500 }, (_, index) => index))
// MyDataTemplateSelector from the code-behind: even indices use the normal
// template, odd indices the accent one.  ItemsRepeater resolves this by name
// from the page scope, matching how XAML resolves a code-behind selector.
const MyDataTemplateSelector = defineComponent({ name: 'MyDataTemplateSelector', SelectTemplateCore: (item) => Number(item) % 2 === 0 ? 'Normal' : 'Accent', setup: () => () => null })
const virtualizingLayoutKey = ref('MyFeedLayout')
const virtualizingLayout = computed(() => `{StaticResource ${virtualizingLayoutKey.value}}`)
const virtualizingOutput = computed(() => t('sample.itemsrepeater.items-layout-output', { count: numbers.value.length, layout: virtualizingLayoutKey.value === 'MyFeedLayout' ? customVirtualizingLayoutLabel : uniformGridOptionLabel }))
const virtualizingTemplate = '{StaticResource MyDataTemplateSelector}'
const virtualizingTemplateSubstitution = 'MyDataTemplateSelector'
const sampleCodeLayout2 = ref(`<common:ActivityFeedLayout x:Key="MyFeedLayout" ColumnSpacing="12"
                          RowSpacing="12" MinItemSize="80, 108"/>`)
const LayoutBtn_SelectionChanged = (args) => {
  const layoutKey = args?.SelectedItem?.Tag
  if (typeof layoutKey !== 'string') return
  virtualizingLayoutKey.value = layoutKey
  sampleCodeLayout2.value = layoutKey === 'UniformGridLayout2'
    ? `<UniformGridLayout x:Key="UniformGridLayout2" MinItemWidth="108" MinItemHeight="108"
                       MinRowSpacing="12" MinColumnSpacing="12"/>`
    : `<common:ActivityFeedLayout x:Key="MyFeedLayout" ColumnSpacing="12"
                          RowSpacing="12" MinItemSize="80, 108"/>`
}

/* ------------------------------------------------------------------ *
 * Example 3: Mixed-type collection
 * ------------------------------------------------------------------ */

const mixedItems = [
  64,
  t('sample.itemsrepeater.mixed-text-1'),
  128,
  t('sample.itemsrepeater.mixed-text-2'),
  256,
  t('sample.itemsrepeater.mixed-text-3'),
  512,
  t('sample.itemsrepeater.mixed-text-4'),
  1024
]
// StringOrIntTemplateSelector from the code-behind: strings use
// StringDataTemplate, integers use IntDataTemplate.
const StringOrIntTemplateSelector = defineComponent({ name: 'StringOrIntTemplateSelector', SelectTemplateCore: (item) => typeof item === 'string' ? 'StringTemplate' : 'IntTemplate', setup: () => () => null })
const mixedOutput = computed(() => t('sample.itemsrepeater.mixed-output', { integers: mixedItems.filter((item) => typeof item === 'number').length, strings: mixedItems.filter((item) => typeof item === 'string').length }))

/* ------------------------------------------------------------------ *
 * Example 4: Nested ItemsRepeaters
 * ------------------------------------------------------------------ */

const foodGroups = {
  fruits: ['apricots', 'bananas', 'grapes', 'strawberries', 'watermelon', 'plums', 'blueberries'],
  vegetables: ['broccoli', 'spinach', 'sweet-potato', 'cauliflower', 'onion', 'brussels-sprouts', 'carrots'],
  grains: ['rice', 'quinoa', 'pasta', 'bread', 'farro', 'oats', 'barley'],
  proteins: ['steak', 'chicken', 'tofu', 'salmon', 'pork', 'chickpeas', 'eggs']
}
const nestedItems = Object.fromEntries(Object.entries(foodGroups).map(([key, foods]) => [key, foods.map((food) => t(`sample.itemsrepeater.food.${food}`))]))
const categories = Object.entries(nestedItems).map(([key, CategoryItems]) => ({ CategoryName: t(`sample.itemsrepeater.category.${key}`), CategoryItems }))
const nestedOutput = computed(() => t('sample.itemsrepeater.nested-output', { categories: categories.length, items: categories.reduce((count, category) => count + category.CategoryItems.length, 0) }))

/* ------------------------------------------------------------------ *
 * Example 5: Animated Scrolling and Content Display
 * ------------------------------------------------------------------ */

const colors = [
  'Blue', 'BlueViolet', 'Crimson', 'DarkCyan', 'DarkGoldenrod', 'DarkMagenta', 'DarkOliveGreen',
  'DarkRed', 'DarkSlateBlue', 'DeepPink', 'IndianRed', 'MediumSlateBlue', 'Maroon', 'MidnightBlue',
  'Peru', 'SaddleBrown', 'SteelBlue', 'OrangeRed', 'Firebrick', 'DarkKhaki'
]
const selectedColor = ref('')
const selectedColorName = ref('')
const colorItems = colors.map((Color) => ({ Color, Name: t(`sample.itemsrepeater.color.${Color}`) }))
const colorRectangleLabel = t('sample.itemsrepeater.color-rectangle')
const selectedColorOutput = computed(() => selectedColorName.value ? t('sample.itemsrepeater.selected-color-output', { color: selectedColorName.value }) : t('sample.itemsrepeater.no-color-selected'))
const animatedElements = new Set()
let previouslyFocusedIndex = -1
const animatedViewport = (element) => element?.closest('.win-scroll-viewer-viewport')
const updateAnimatedScale = (element) => {
  const viewport = animatedViewport(element)
  const wrapper = element.parentElement
  if (!viewport || !viewport.clientHeight) return
  const distance = Math.abs(viewport.clientHeight / 2 + viewport.scrollTop - (wrapper.offsetTop + element.offsetHeight / 2))
  const scale = 1 - distance * (.25 / (viewport.clientHeight / 2))
  element.style.transformOrigin = 'center'
  element.style.scale = String(scale)
}
const OnElementPrepared = (args) => { animatedElements.add(args.Element); updateAnimatedScale(args.Element) }
const OnElementClearing = (args) => { animatedElements.delete(args.Element); args.Element.style.removeProperty('scale') }
const Animated_ScrollViewer_ViewChanged = () => { for (const element of animatedElements) updateAnimatedScale(element) }
const OnAnimatedItemGotFocus = (sender, args) => {
  const button = sender?.Element ?? args?.OriginalEvent?.target?.closest?.('.win-btn')
  if (!button?.parentElement) return
  previouslyFocusedIndex = Number(button.parentElement.dataset.index)
  const viewport = animatedViewport(button)
  viewport?.scrollTo({ top: button.parentElement.offsetTop + button.offsetHeight / 2 - viewport.clientHeight / 2, behavior: 'smooth' })
}
const OnAnimatedScrollRepeaterGettingFocus = (args) => {
  const repeater = args.NewFocusedElement?.closest('.win-items-repeater')
  if (previouslyFocusedIndex >= 0 && args.OldFocusedElement && !repeater?.contains(args.OldFocusedElement)) {
    args.NewFocusedElement = repeater?.querySelector(`:scope > [data-index="${previouslyFocusedIndex}"] button`) ?? args.NewFocusedElement
  }
}
const OnAnimatedScrollRepeaterKeyDown = (args) => {
  const index = args.Key === 'Home' ? 0 : args.Key === 'End' ? colorItems.length - 1 : -1
  if (index < 0 || index === previouslyFocusedIndex) return
  const repeater = args.OriginalSource.closest('.win-items-repeater')
  repeater?.querySelector(`:scope > [data-index="${index}"] button`)?.focus({ preventScroll: true })
  args.Handled = true
}
onBeforeUnmount(() => animatedElements.clear())
// OnAnimatedItemClicked mirrors the code-behind: the clicked Button's own
// Background becomes the rectangle's Fill.
const OnAnimatedItemClicked = (sender, args) => {
  const button = sender?.Element ?? args?.OriginalEvent?.target?.closest?.('.win-btn')
  const index = Number(button?.parentElement?.dataset.index)
  if (!colorItems[index]) return
  selectedColor.value = colorItems[index].Color
  selectedColorName.value = colorItems[index].Name
  for (const element of animatedElements) element.removeAttribute('aria-current')
  button.setAttribute('aria-current', 'true')
}

/* ------------------------------------------------------------------ *
 * Example 6: Virtualized, Content-Heavy Layout with Filtering and Sorting
 * ------------------------------------------------------------------ */

const ingredientsByCategory = Object.values(nestedItems)
const extras = ['garlic', 'lemon', 'butter', 'lime', 'feta-cheese', 'parmesan-cheese', 'breadcrumbs'].map((key) => t(`sample.itemsrepeater.food.${key}`))
const pick = (list) => list[Math.floor(Math.random() * (list.length - 1))]
const buildRecipes = (count) => Array.from({ length: count }, (_, index) => {
  const ingredients = ingredientsByCategory.map((list) => pick(list))
  const extraCount = Math.floor(Math.random() * 4)
  for (let step = 0; step < extraCount; step += 1) {
    const candidate = pick(extras)
    if (!ingredients.includes(candidate)) ingredients.push(candidate)
  }
  return {
    Num: index,
    Name: t('sample.itemsrepeater.recipe-name', { number: index }),
    Color: pick(colors),
    IngList: ingredients,
    Ingredients: `\n${ingredients.join('\n')}`
  }
})
const staticRecipes = buildRecipes(1000)
const recipeFilter = ref('')
const isSortDescending = ref(false)
const sortRequested = ref(false)
const visibleRecipes = computed(() => {
  const needle = recipeFilter.value.toLowerCase()
  const filtered = needle
    ? staticRecipes.filter((recipe) => recipe.Ingredients.toLowerCase().includes(needle))
    : staticRecipes
  return sortRequested.value ? [...filtered].sort((left, right) => isSortDescending.value
    ? right.IngList.length - left.IngList.length
    : left.IngList.length - right.IngList.length) : filtered
})
const filteredRecipesOutput = computed(() => t('sample.itemsrepeater.filtered-recipes-output', { count: visibleRecipes.value.length }))
const FilterRecipes_FilterChanged = () => { sortRequested.value = true }
const OnSortAscClick = () => { if (isSortDescending.value) { isSortDescending.value = false; sortRequested.value = true } }
const OnSortDesClick = () => { if (!isSortDescending.value) { isSortDescending.value = true; sortRequested.value = true } }

/* ------------------------------------------------------------------ *
 * Source code panes
 * ------------------------------------------------------------------ */

const sampleCodeLayouts = {
  VerticalStackLayout: '<StackLayout x:Name="VerticalStackLayout" Orientation="Vertical" Spacing="8"/>',
  HorizontalStackLayout: '<StackLayout x:Name="HorizontalStackLayout" Orientation="Horizontal" Spacing="8"/>',
  UniformGridLayout: '<UniformGridLayout x:Name="UniformGridLayout" MinRowSpacing="8" MinColumnSpacing="8"/>'
}
const sampleCodeTemplates = {
  VerticalStackLayout: `<DataTemplate x:Key="HorizontalBarTemplate" x:DataType="l:Bar">
    <Border Background="{ThemeResource SystemChromeLowColor}" Width="{x:Bind MaxLength}" >
        <Rectangle Fill="{ThemeResource SystemAccentColor}" Width="{x:Bind Length}"
                   Height="24" HorizontalAlignment="Left"/>
    </Border>
</DataTemplate>`,
  HorizontalStackLayout: `<DataTemplate x:Key="VerticalBarTemplate" x:DataType="l:Bar">
    <Border Background="{ThemeResource SystemChromeLowColor}" Height="{x:Bind MaxHeight}">
        <Rectangle Fill="{ThemeResource SystemAccentColor}" Height="{x:Bind Height}"
                   Width="48" VerticalAlignment="Top"/>
    </Border>
</DataTemplate>`,
  UniformGridLayout: `<DataTemplate x:Key="CircularTemplate" x:DataType="l:Bar">
    <Grid>
        <Ellipse Fill="{ThemeResource SystemChromeLowColor}" Height="{x:Bind MaxDiameter}"
                 Width="{x:Bind MaxDiameter}" VerticalAlignment="Center" HorizontalAlignment="Center"/>
        <Ellipse Fill="{ThemeResource SystemAccentColor}" Height="{x:Bind Diameter}"
                 Width="{x:Bind Diameter}" VerticalAlignment="Center" HorizontalAlignment="Center"/>
    </Grid>
</DataTemplate>`
}

const basicXaml = computed(() => `<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer HorizontalScrollBarVisibility="Auto"
              HorizontalScrollMode="Auto"
              IsVerticalScrollChainingEnabled="False"
              MaxHeight="500">
    <ItemsRepeater x:Name="repeater"
               ItemsSource="{x:Bind BarItems}"
               Layout="{StaticResource ${basicLayoutKey.value}}"
               ItemTemplate="{StaticResource ${basicTemplateKey.value}}" />
</ScrollViewer>

<!-- The Layout specifications used: -->

${sampleCodeLayouts[basicLayoutKey.value]}

<!-- The DataTemplate used: ${basicTemplateKey.value}-->

${sampleCodeTemplates[basicLayoutKey.value]}`)

const virtualizingXaml = computed(() => `<!-- The ItemsRepeater and ScrollViewer used: -->
<ScrollViewer x:Name="scrollViewer"
                Height="400"
                IsVerticalScrollChainingEnabled="False"
                Padding="0,0,16,0">
    <ItemsRepeater
            ItemsSource="{x:Bind Numbers}"
            Layout="{StaticResource ${virtualizingLayoutKey.value}}"
            ItemTemplate="{StaticResource ${virtualizingTemplateSubstitution}}" />
</ScrollViewer>

<!-- The Layout specifications used: -->

${sampleCodeLayout2.value}

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
details about this custom layout. -->`)
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
:deep(.example-output) { grid-column: 1 / -1; grid-row: 2; justify-self: stretch; max-width: none; margin: 0; padding: 12px; border-top: 1px solid var(--DividerStrokeColorDefaultBrush); border-radius: 0; }
@media (max-width: 739px) {
  :deep(.example-options) { grid-row: 2; }
  :deep(.example-container.has-options .example-output) { grid-row: 3; }
  .animated-example { min-width: 524px; }
  .recipes-example { min-width: 424px; }
}
</style>
