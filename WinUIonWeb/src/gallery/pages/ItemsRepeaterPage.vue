<template>
  <ScrollViewer
    class="gallery-page-scroll"
    VerticalScrollBarVisibility="Auto"
    VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.itemsrepeater'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.itemsrepeater-description'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('sample.itemsrepeater.basic-non-interactive'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}">
          <ControlExample.Example>
            <ScrollViewer MaxHeight="500" HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" IsVerticalScrollChainingEnabled="False" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
              <ItemsRepeater ItemsSource="{x:Bind barItems, Mode=OneWay}" Layout="{x:Bind basicLayout, Mode=OneWay}" MaxWidth="{x:Bind basicRepeaterMaxWidth, Mode=OneWay}" Visibility="{x:Bind basicVerticalVisibility, Mode=OneWay}">
                <ItemsRepeater.ItemTemplate><DataTemplate><Border Width="{x:Bind MaxLength}" Background="{ThemeResource SystemChromeLowColor}"><Rectangle Width="{x:Bind Length}" Height="24" HorizontalAlignment="Left" Fill="{ThemeResource SystemAccentColor}" /></Border></DataTemplate></ItemsRepeater.ItemTemplate>
              </ItemsRepeater>
              <ItemsRepeater ItemsSource="{x:Bind barItems, Mode=OneWay}" Layout="{x:Bind basicLayout, Mode=OneWay}" MaxWidth="{x:Bind basicRepeaterMaxWidth, Mode=OneWay}" Visibility="{x:Bind basicHorizontalVisibility, Mode=OneWay}">
                <ItemsRepeater.ItemTemplate><DataTemplate><Border Height="{x:Bind MaxHeight}" Background="{ThemeResource SystemChromeLowColor}"><Rectangle Width="48" Height="{x:Bind Height}" VerticalAlignment="Top" Fill="{ThemeResource SystemAccentColor}" /></Border></DataTemplate></ItemsRepeater.ItemTemplate>
              </ItemsRepeater>
              <ItemsRepeater ItemsSource="{x:Bind barItems, Mode=OneWay}" Layout="{x:Bind basicLayout, Mode=OneWay}" MaxWidth="{x:Bind basicRepeaterMaxWidth, Mode=OneWay}" Visibility="{x:Bind basicGridVisibility, Mode=OneWay}">
                <ItemsRepeater.ItemTemplate><DataTemplate><Grid><Border Width="{x:Bind MaxDiameter}" Height="{x:Bind MaxDiameter}" HorizontalAlignment="Center" VerticalAlignment="Center" CornerRadius="999" Background="{ThemeResource SystemChromeLowColor}" /><Border Width="{x:Bind Diameter}" Height="{x:Bind Diameter}" HorizontalAlignment="Center" VerticalAlignment="Center" CornerRadius="999" Background="{ThemeResource SystemAccentColor}" /></Grid></DataTemplate></ItemsRepeater.ItemTemplate>
              </ItemsRepeater>
            </ScrollViewer>
          </ControlExample.Example>
          <ControlExample.Options>
            <StackPanel Spacing="12">
              <Button MinWidth="150" Click="AddBtn_Click" Content="{x:Bind $t('sample.add-item'), Mode=OneWay}" />
              <Button MinWidth="150" Click="DeleteBtn_Click" IsEnabled="{x:Bind canDeleteBar, Mode=OneWay}" Content="{x:Bind $t('sample.remove-item'), Mode=OneWay}" />
              <RadioButtons Header="{x:Bind $t('sample.layout'), Mode=OneWay}" ItemsSource="{x:Bind layoutOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind layoutIndex, Mode=TwoWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample HorizontalContentAlignment="Stretch" HeaderText="{x:Bind $t('sample.itemsrepeater.virtualizing-scrollable-list-items'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind virtualXaml, Mode=OneWay}">
          <ControlExample.Example>
            <ScrollViewer Height="400" Padding="0,0,16,0" IsVerticalScrollChainingEnabled="False" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
              <ItemsRepeater Margin="0,0,12,0" ItemsSource="{x:Bind numbers, Mode=OneWay}" HorizontalAlignment="Stretch" Layout="{x:Bind virtualLayout, Mode=OneWay}">
                <ItemsRepeater.Layout><UniformGridLayout MinItemWidth="108" MinItemHeight="108" MinColumnSpacing="12" MinRowSpacing="12" /></ItemsRepeater.Layout>
                <ItemsRepeater.ItemTemplate><DataTemplate><Button HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Background="{x:Bind Background}" Foreground="{x:Bind Foreground}"><TextBlock HorizontalAlignment="Center" VerticalAlignment="Center" Text="{x:Bind Value}" /></Button></DataTemplate></ItemsRepeater.ItemTemplate>
              </ItemsRepeater>
            </ScrollViewer>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.itemsrepeater.mixed-type-collection'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind mixedXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Text="{x:Bind $t('sample.itemsrepeater.mixed-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ItemsRepeater Margin="0,0,12,0" HorizontalAlignment="Stretch" ItemsSource="{x:Bind mixedItems, Mode=OneWay}" Layout="{x:Bind mixedLayout, Mode=OneWay}">
                <ItemsRepeater.ItemTemplate><DataTemplate><Grid Margin="{x:Bind Margin}" Background="{x:Bind Background}"><TextBlock Padding="10" HorizontalAlignment="Center" VerticalAlignment="Center" Foreground="{x:Bind Foreground}" Text="{x:Bind Value}" TextWrapping="WrapWholeWords" /></Grid></DataTemplate></ItemsRepeater.ItemTemplate>
              </ItemsRepeater>
            </StackPanel>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.itemsrepeater.nested'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind nestedXaml, Mode=OneWay}">
          <ControlExample.Example>
            <ScrollViewer HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto">
              <ItemsRepeater ItemsSource="{x:Bind categories, Mode=OneWay}" Layout="{x:Bind nestedLayout, Mode=OneWay}" VerticalAlignment="Top">
                <ItemsRepeater.ItemTemplate><DataTemplate><StackPanel><TextBlock Padding="8" FontWeight="SemiBold" Text="{x:Bind CategoryName}" /><ItemsRepeater ItemsSource="{x:Bind CategoryItems, Mode=OneWay}" Layout="{x:Bind childLayout, Mode=OneWay}"><ItemsRepeater.ItemTemplate><DataTemplate><Grid Margin="10,0,10,10" Background="{ThemeResource SystemControlBackgroundAccentBrush}"><TextBlock Padding="10" HorizontalAlignment="Center" VerticalAlignment="Center" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind}" TextWrapping="WrapWholeWords" /></Grid></DataTemplate></ItemsRepeater.ItemTemplate></ItemsRepeater></StackPanel></DataTemplate></ItemsRepeater.ItemTemplate>
              </ItemsRepeater>
            </ScrollViewer>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.itemsrepeater.animated-scrolling-content-display'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind animatedXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid>
              <Grid.ColumnDefinitions><ColumnDefinition Width="1*" /><ColumnDefinition Width="1*" /></Grid.ColumnDefinitions>
              <ScrollViewer Grid.Column="0" Width="250" Height="175" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
                <ItemsRepeater ItemsSource="{x:Bind colors, Mode=OneWay}" GettingFocus="OnAnimatedScrollRepeaterGettingFocus" KeyDown="OnAnimatedScrollRepeaterKeyDown">
                  <ItemsRepeater.ItemTemplate><DataTemplate><Button HorizontalAlignment="Stretch" Background="{x:Bind}" Foreground="{ThemeResource ButtonForeground}" Click="OnAnimatedItemClicked"><TextBlock Text="{x:Bind}" /></Button></DataTemplate></ItemsRepeater.ItemTemplate>
                </ItemsRepeater>
              </ScrollViewer>
              <Rectangle Grid.Column="1" Width="150" Height="150" Margin="10,0,0,0" Fill="{x:Bind selectedColor, Mode=OneWay}" Stroke="Black" />
            </Grid>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.itemsrepeater.virtualized-content-heavy-layout'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind heavyXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid Height="600">
              <Grid.ColumnDefinitions><ColumnDefinition Width="1*" /><ColumnDefinition Width="1*" /></Grid.ColumnDefinitions>
              <ScrollViewer Grid.Column="0" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
                <ItemsRepeater ItemsSource="{x:Bind visibleRecipes, Mode=OneWay}" Layout="{x:Bind recipeLayout, Mode=OneWay}">
                  <ItemsRepeater.ItemTemplate><DataTemplate><StackPanel Width="190" Margin="5" Background="{ThemeResource SystemControlBackgroundBaseLowBrush}" BorderThickness="1"><StackPanel Height="75" Margin="8" Background="{x:Bind Color}" Opacity=".8"><TextBlock Padding="12" FontSize="35" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" Text="{x:Bind Num}" TextAlignment="Center" /></StackPanel><TextBlock Margin="15,0,10,0" FontWeight="SemiBold" Text="{x:Bind Name}" TextWrapping="WrapWholeWords" /><TextBlock Margin="15,0,15,15" Text="{x:Bind Ingredients}" TextWrapping="WrapWholeWords" /></StackPanel></DataTemplate></ItemsRepeater.ItemTemplate>
                </ItemsRepeater>
              </ScrollViewer>
              <StackPanel Grid.Column="1" Margin="10,0,0,0">
                <TextBox Width="200" Margin="0,0,0,20" HorizontalAlignment="Left" VerticalAlignment="Top" Header="{x:Bind $t('sample.filter-by-ingredient'), Mode=OneWay}" Text="{x:Bind recipeFilter, Mode=TwoWay}" />
                <TextBlock Margin="0,0,0,10" Text="{x:Bind $t('sample.sort-by-number-of-ingredients'), Mode=OneWay}" />
                <Button Margin="0,0,0,5" Click="OnSortAscClick" Content="{x:Bind $t('sample.least-to-most'), Mode=OneWay}" />
                <Button Click="OnSortDesClick" Content="{x:Bind $t('sample.most-to-least'), Mode=OneWay}" />
              </StackPanel>
            </Grid>
          </ControlExample.Example>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import Border from '../../components/Border.vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Grid from '../../components/Grid.vue'
import ItemsRepeater from '../../components/ItemsRepeater.vue'
import RadioButtons from '../../components/RadioButtons.vue'
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
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const makeBar = (length) => ({ Length: length, MaxLength: 425, Height: length / 4, MaxHeight: 425 / 4, Diameter: length / 6, MaxDiameter: 425 / 6 })
const barItems = ref([makeBar(300), makeBar(25), makeBar(175)])
const layoutIndex = ref(0)
const layoutOptions = computed(() => [
  { Value: 'VerticalStackLayout', Text: t('sample.stacklayout-vertical') },
  { Value: 'HorizontalStackLayout', Text: t('sample.stacklayout-horizontal') },
  { Value: 'UniformGridLayout', Text: t('sample.uniform-grid') }
])
const basicLayoutKey = computed(() => layoutOptions.value[layoutIndex.value]?.Value || 'VerticalStackLayout')
const basicLayout = computed(() => basicLayoutKey.value === 'HorizontalStackLayout'
  ? { Type: 'StackLayout', Orientation: 'Horizontal', Spacing: 8 }
  : basicLayoutKey.value === 'UniformGridLayout'
    ? { Type: 'UniformGridLayout', MinColumnSpacing: 8, MinRowSpacing: 8, MinItemWidth: 100, MinItemHeight: 100 }
    : { Type: 'StackLayout', Orientation: 'Vertical', Spacing: 8 })
const basicRepeaterMaxWidth = computed(() => basicLayoutKey.value === 'HorizontalStackLayout' ? 6000 : basicLayoutKey.value === 'UniformGridLayout' ? 540 : 437)
const basicVerticalVisibility = computed(() => basicLayoutKey.value === 'VerticalStackLayout' ? 'Visible' : 'Collapsed')
const basicHorizontalVisibility = computed(() => basicLayoutKey.value === 'HorizontalStackLayout' ? 'Visible' : 'Collapsed')
const basicGridVisibility = computed(() => basicLayoutKey.value === 'UniformGridLayout' ? 'Visible' : 'Collapsed')
const canDeleteBar = computed(() => barItems.value.length > 0)
const AddBtn_Click = () => barItems.value.push(makeBar(Math.floor(Math.random() * 425)))
const DeleteBtn_Click = () => { if (barItems.value.length) barItems.value.shift() }

const numbers = Array.from({ length: 500 }, (_, index) => ({ Value: index, Background: index % 2 ? 'var(--accent-base)' : 'var(--ctrl-fill-secondary)', Foreground: index % 2 ? 'var(--accent-text)' : 'var(--text-primary)' }))
const virtualLayout = computed(() => layoutIndex.value === 0
  ? { Type: 'ActivityFeedLayout', MinItemWidth: 80, MinItemHeight: 108, MinColumnSpacing: 12, MinRowSpacing: 12 }
  : { Type: 'UniformGridLayout', MinItemWidth: 108, MinItemHeight: 108, MinColumnSpacing: 12, MinRowSpacing: 12 })
const virtualXaml = '<ScrollViewer Height="400" IsVerticalScrollChainingEnabled="False" Padding="0,0,16,0"><ItemsRepeater Margin="0,0,12,0" ItemsSource="{x:Bind Numbers}" ItemTemplate="{StaticResource MyDataTemplateSelector}" HorizontalAlignment="Stretch"><ItemsRepeater.Layout><ActivityFeedLayout MinItemWidth="80" MinItemHeight="108" MinColumnSpacing="12" MinRowSpacing="12" /></ItemsRepeater.Layout></ItemsRepeater></ScrollViewer>'

const mixedItems = [
  { Value: 64, Background: 'var(--ctrl-fill-secondary)', Foreground: 'var(--text-primary)', Margin: '10' },
  { Value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', Background: 'var(--accent-base)', Foreground: 'var(--accent-text)', Margin: '10' },
  { Value: 128, Background: 'var(--ctrl-fill-secondary)', Foreground: 'var(--text-primary)', Margin: '10' },
  { Value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', Background: 'var(--accent-base)', Foreground: 'var(--accent-text)', Margin: '10' },
  { Value: 256, Background: 'var(--ctrl-fill-secondary)', Foreground: 'var(--text-primary)', Margin: '10' },
  { Value: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', Background: 'var(--accent-base)', Foreground: 'var(--accent-text)', Margin: '10' },
  { Value: 512, Background: 'var(--ctrl-fill-secondary)', Foreground: 'var(--text-primary)', Margin: '10' },
  { Value: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', Background: 'var(--accent-base)', Foreground: 'var(--accent-text)', Margin: '10' },
  { Value: 1024, Background: 'var(--ctrl-fill-secondary)', Foreground: 'var(--text-primary)', Margin: '10' }
]
const mixedLayout = { Type: 'UniformGridLayout', MinItemWidth: 200, MinItemHeight: 200 }

const categories = [
  { CategoryName: 'Fruits', CategoryItems: ['Apricots', 'Bananas', 'Grapes', 'Strawberries', 'Watermelon', 'Plums', 'Blueberries'] },
  { CategoryName: 'Vegetables', CategoryItems: ['Broccoli', 'Spinach', 'Sweet potato', 'Cauliflower', 'Onion', 'Brussels sprouts', 'Carrots'] },
  { CategoryName: 'Grains', CategoryItems: ['Rice', 'Quinoa', 'Pasta', 'Bread', 'Farro', 'Oats', 'Barley'] },
  { CategoryName: 'Proteins', CategoryItems: ['Steak', 'Chicken', 'Tofu', 'Salmon', 'Pork', 'Chickpeas', 'Eggs'] }
]
const nestedLayout = { Type: 'StackLayout', Orientation: 'Vertical' }
const childLayout = { Type: 'StackLayout', Orientation: 'Horizontal' }

const colors = ['Blue', 'BlueViolet', 'Crimson', 'DarkCyan', 'DarkGoldenrod', 'DarkMagenta', 'DarkOliveGreen', 'DarkRed', 'DarkSlateBlue', 'DeepPink', 'IndianRed', 'MediumSlateBlue', 'Maroon', 'MidnightBlue', 'Peru', 'SaddleBrown', 'SteelBlue', 'OrangeRed', 'Firebrick', 'DarkKhaki']
const selectedColor = ref(colors[0])
const OnAnimatedItemClicked = (event) => { const color = event?.currentTarget?.style?.backgroundColor; if (color) selectedColor.value = color }
const OnAnimatedScrollRepeaterGettingFocus = () => undefined
const OnAnimatedScrollRepeaterKeyDown = () => undefined

const recipes = ref(Array.from({ length: 100 }, (_, index) => ({ Num: index, Name: `Recipe ${index}`, Ingredients: index % 3 === 0 ? 'Apple\nCarrot\nRice\nChicken' : index % 3 === 1 ? 'Pear\nSpinach\nQuinoa\nTofu' : 'Orange\nBroccoli\nPasta\nSalmon', Color: colors[index % colors.length] })))
const staticRecipes = recipes.value.slice()
const recipeFilter = ref('')
const descending = ref(false)
const visibleRecipes = computed(() => { const filter = recipeFilter.value.trim().toLowerCase(); const result = staticRecipes.filter((recipe) => !filter || recipe.Ingredients.toLowerCase().includes(filter)); return [...result].sort((a, b) => descending.value ? b.Num - a.Num : a.Num - b.Num) })
const OnSortAscClick = () => { descending.value = false }
const OnSortDesClick = () => { descending.value = true }
const recipeLayout = { Type: 'VariedImageSizeLayout', MinItemWidth: 200, MinColumnSpacing: 12, MinRowSpacing: 12 }

const basicXaml = '<ScrollViewer HorizontalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" IsVerticalScrollChainingEnabled="False" MaxHeight="500"><ItemsRepeater ItemsSource="{x:Bind BarItems, Mode=OneWay}"><ItemsRepeater.ItemTemplate><DataTemplate><Border Width="{x:Bind MaxLength}" Background="{ThemeResource SystemChromeLowColor}"><Rectangle Width="{x:Bind Length}" Height="24" Fill="{ThemeResource SystemAccentColor}" /></Border></DataTemplate></ItemsRepeater.ItemTemplate><ItemsRepeater.Layout><StackLayout Orientation="Vertical" Spacing="8" /></ItemsRepeater.Layout></ItemsRepeater></ScrollViewer>'
const mixedXaml = '<ItemsRepeater Margin="0,0,12,0" HorizontalAlignment="Stretch" ItemsSource="{x:Bind MixedItems, Mode=OneWay}"><ItemsRepeater.ItemTemplate><DataTemplate><Grid Margin="{x:Bind Margin}" Background="{x:Bind Background}"><TextBlock Padding="10" HorizontalAlignment="Center" VerticalAlignment="Center" Foreground="{x:Bind Foreground}" Text="{x:Bind Value}" TextWrapping="Wrap" /></Grid></DataTemplate></ItemsRepeater.ItemTemplate><ItemsRepeater.Layout><UniformGridLayout MinItemWidth="200" MinItemHeight="200" /></ItemsRepeater.Layout></ItemsRepeater>'
const nestedXaml = '<ScrollViewer HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto"><ItemsRepeater ItemsSource="{x:Bind Categories, Mode=OneWay}" VerticalAlignment="Top"><ItemsRepeater.ItemTemplate><DataTemplate><StackPanel><TextBlock Padding="8" FontWeight="SemiBold" Text="{x:Bind CategoryName}" /><ItemsRepeater ItemsSource="{x:Bind CategoryItems, Mode=OneWay}"><ItemsRepeater.ItemTemplate><DataTemplate><Grid Margin="10,0,10,10" Background="{ThemeResource SystemControlBackgroundAccentBrush}"><TextBlock Padding="10" Text="{x:Bind}" /></Grid></DataTemplate></ItemsRepeater.ItemTemplate><ItemsRepeater.Layout><StackLayout Orientation="Horizontal" /></ItemsRepeater.Layout></ItemsRepeater></StackPanel></DataTemplate></ItemsRepeater.ItemTemplate><ItemsRepeater.Layout><StackLayout Orientation="Vertical" /></ItemsRepeater.Layout></ItemsRepeater></ScrollViewer>'
const animatedXaml = '<Grid><Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions><ScrollViewer Grid.Column="0" Height="175" Width="250"><ItemsRepeater ItemsSource="{x:Bind Colors, Mode=OneWay}" GettingFocus="OnAnimatedScrollRepeaterGettingFocus" KeyDown="OnAnimatedScrollRepeaterKeyDown"><ItemsRepeater.ItemTemplate><DataTemplate><Button HorizontalAlignment="Stretch" Click="OnAnimatedItemClicked"><TextBlock Text="{x:Bind}" /></Button></DataTemplate></ItemsRepeater.ItemTemplate></ItemsRepeater></ScrollViewer><Rectangle Grid.Column="1" Stroke="Black" Height="150" Width="150" /></Grid>'
const heavyXaml = `<Grid Height="600"><Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions><ScrollViewer Grid.Column="0"><ItemsRepeater ItemsSource="{x:Bind VisibleRecipes, Mode=OneWay}"><ItemsRepeater.ItemTemplate><DataTemplate><StackPanel Width="190" Margin="5"><TextBlock Text="{x:Bind Name}" /><TextBlock Text="{x:Bind Ingredients}" TextWrapping="Wrap" /></StackPanel></DataTemplate></ItemsRepeater.ItemTemplate><ItemsRepeater.Layout><VariedImageSizeLayout MinItemWidth="200" MinColumnSpacing="12" MinRowSpacing="12" /></ItemsRepeater.Layout></ItemsRepeater></ScrollViewer><StackPanel Grid.Column="1"><TextBox Header="{x:Bind $t('sample.filter-by-ingredient'), Mode=OneWay}" Text="{x:Bind recipeFilter, Mode=TwoWay}" /><TextBlock Text="{x:Bind $t('sample.sort-by-number-of-ingredients'), Mode=OneWay}" /><Button Click="OnSortAscClick" Content="{x:Bind $t('sample.least-to-most'), Mode=OneWay}" /><Button Click="OnSortDesClick" Content="{x:Bind $t('sample.most-to-least'), Mode=OneWay}" /></StackPanel></Grid>`
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
