<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.listview'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.a-listview-displays-data-in-a-vertical-list-with'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('sample.listview.basic-simple-datatemplate'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,16" Text="{x:Bind $t('sample.listview.basic-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView Width="350" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind contacts, Mode=OneWay}" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" SelectionMode="Single">
                <ListView.ItemTemplate>
                  <DataTemplate><TextBlock Margin="0,5,0,5" Text="{x:Bind Name}" /></DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample class="listview-selection-example" HeaderText="{x:Bind $t('sample.listview.selection-support'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind selectionXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.listview.selection-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind contacts, Mode=OneWay}" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" SelectionMode="{x:Bind selectionMode, Mode=OneWay}">
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid class="listview-contact-template">
                      <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Border class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" CornerRadius="16" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                      <TextBlock Grid.Column="1" Margin="12,6,0,0" Text="{x:Bind Name}" />
                      <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" Text="{x:Bind Company}" />
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Options>
            <StackPanel><ComboBox Margin="0,12,0,0" Header="{x:Bind $t('sample.selection-mode'), Mode=OneWay}" ItemsSource="{x:Bind selectionModeOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind selectionModeIndex, Mode=TwoWay}" /></StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.listview.drag-drop-reordering'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind dragXaml, Mode=OneWay}">
          <ControlExample.Example>
            <Grid>
              <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
              <Grid.ColumnDefinitions><ColumnDefinition Width="1*" /><ColumnDefinition Width="1*" /></Grid.ColumnDefinitions>
              <TextBlock class="listview-drag-description" Style="{StaticResource BodyTextBlockStyle}" Text="{x:Bind $t('sample.listview.drag-drop-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView class="listview-drag-source" Grid.Row="1" Grid.Column="0" ItemsSource="{x:Bind dragLeft, Mode=TwoWay}" Height="400" MinWidth="350" Margin="0" SelectionMode="Single" CanDragItems="True" CanReorderItems="True" AllowDrop="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" DragItemsStarting="beginDragLeft" DragItemsCompleted="endDrag" DragOver="dragOverLeft" Drop="dropLeft">
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid class="listview-contact-template">
                      <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Border class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" CornerRadius="16" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                      <TextBlock Grid.Column="1" Margin="12,6,0,0" Text="{x:Bind Name}" />
                      <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" Text="{x:Bind Company}" />
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
              <ListView class="listview-drag-target" Grid.Row="1" Grid.Column="1" ItemsSource="{x:Bind dragRight, Mode=TwoWay}" Height="400" MinWidth="350" SelectionMode="Single" CanDragItems="True" CanReorderItems="True" AllowDrop="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" DragItemsStarting="beginDragRight" DragItemsCompleted="endDrag" DragOver="dragOverRight" Drop="dropRight">
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid class="listview-contact-template">
                      <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Border class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" CornerRadius="16" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                      <TextBlock Grid.Column="1" Margin="12,6,0,0" Text="{x:Bind Name}" />
                      <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" Text="{x:Bind Company}" />
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </Grid>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample class="listview-grouped-example" HeaderText="{x:Bind $t('sample.listview.grouped-headers'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind groupedXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.listview.grouped-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView class="listview-grouped-control" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind groups, Mode=OneWay}" SelectionMode="Single" ShowsScrollingPlaceholders="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1">
                <ListView.ItemsPanel><ItemsPanelTemplate><ItemsStackPanel AreStickyGroupHeadersEnabled="{x:Bind stickyOn, Mode=OneWay}" /></ItemsPanelTemplate></ListView.ItemsPanel>
                <ListView.GroupStyle>
                  <GroupStyle>
                    <GroupStyle.HeaderTemplate><DataTemplate><Border AutomationProperties.AccessibilityView="Raw"><TextBlock AutomationProperties.AccessibilityView="Raw" Style="{ThemeResource TitleTextBlockStyle}" Text="{x:Bind Key}" /></Border></DataTemplate></GroupStyle.HeaderTemplate>
                  </GroupStyle>
                </ListView.GroupStyle>
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid class="listview-contact-template">
                      <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Border class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" CornerRadius="16" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                      <TextBlock Grid.Column="1" Margin="12,6,0,0" Text="{x:Bind Name}" />
                      <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" Text="{x:Bind Company}" />
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Options><StackPanel><ToggleSwitch Header="{x:Bind $t('sample.sticky-headers'), Mode=OneWay}" IsOn="{x:Bind stickyOn, Mode=TwoWay}" /></StackPanel></ControlExample.Options>
        </ControlExample>

        <ControlExample class="listview-filtering-example" HeaderText="{x:Bind $t('sample.listview.filtering'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind filteringXaml, Mode=OneWay}">
          <ControlExample.Example>
            <ListView class="listview-filtering-control" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind filteredContacts, Mode=OneWay}" SelectionMode="Single" ShowsScrollingPlaceholders="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1">
              <ListView.ItemTemplate>
                <DataTemplate>
                  <Grid class="listview-contact-template">
                    <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                    <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                    <Border class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" CornerRadius="16" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                    <TextBlock Grid.Column="1" Margin="12,6,0,0" Text="{x:Bind Name}" />
                    <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" Text="{x:Bind Company}" />
                  </Grid>
                </DataTemplate>
              </ListView.ItemTemplate>
            </ListView>
          </ControlExample.Example>
          <ControlExample.Options>
            <StackPanel Width="200">
              <TextBlock Margin="8,8,8,4" Text="{x:Bind $t('sample.filter-by'), Mode=OneWay}" />
              <TextBox Width="150" HorizontalAlignment="Left" Margin="8" Header="{x:Bind $t('sample.listview.first-name'), Mode=OneWay}" Text="{x:Bind filterText, Mode=TwoWay}" />
              <TextBox Width="150" HorizontalAlignment="Left" Margin="8" Header="{x:Bind $t('sample.listview.last-name'), Mode=OneWay}" Text="{x:Bind filterLastName, Mode=TwoWay}" />
              <TextBox Width="150" HorizontalAlignment="Left" Margin="8" Header="{x:Bind $t('sample.listview.company'), Mode=OneWay}" Text="{x:Bind filterCompany, Mode=TwoWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample class="listview-messaging-example" HeaderText="{x:Bind $t('sample.listview.messaging'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind messagingXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.listview.messaging-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView Height="400" ItemsSource="{x:Bind messages, Mode=OneWay}" SelectionMode="None" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1">
                <ListView.ItemsPanel><ItemsPanelTemplate><ItemsStackPanel VerticalAlignment="Bottom" ItemsUpdatingScrollMode="KeepLastItemInView" /></ItemsPanelTemplate></ListView.ItemsPanel>
                <ListView.ItemContainerStyle><Style TargetType="ListViewItem"><Setter Property="HorizontalContentAlignment" Value="Stretch" /></Style></ListView.ItemContainerStyle>
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid Height="Auto" Margin="4" HorizontalAlignment="{x:Bind MsgAlignment}">
                      <StackPanel Width="350" MinHeight="75" Padding="10,0,0,10" Background="{ThemeResource SystemColorHighlightColor}" CornerRadius="{StaticResource ControlCornerRadius}">
                        <TextBlock Padding="0,10,0,0" FontSize="20" Foreground="{ThemeResource SystemColorHighlightTextColor}" Text="{x:Bind MsgText}" />
                        <TextBlock Padding="0,0,0,10" FontSize="15" Foreground="{ThemeResource SystemColorHighlightTextColor}" Text="{x:Bind MsgDateTime}" />
                      </StackPanel>
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind messageOutput, Mode=OneWay}" /></ControlExample.Output>
          <ControlExample.Options>
            <StackPanel HorizontalAlignment="Right">
              <Button Margin="0,0,0,10" Content="{x:Bind $t('sample.listview.send-message'), Mode=OneWay}" Click="sendMessage" />
              <Button Content="{x:Bind $t('sample.listview.receive-message'), Mode=OneWay}" Click="receiveMessage" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample class="listview-images-example" HeaderText="{x:Bind $t('sample.listview.images'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind imagesXaml, Mode=OneWay}">
          <ControlExample.Example>
              <ListView class="listview-images-control" Height="400" MinWidth="550" ItemsSource="{x:Bind imageItems, Mode=OneWay}" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1">
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid class="listview-image-item" Margin="0,12,0,12" AutomationProperties.Name="{x:Bind Title}">
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" MinWidth="150" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Image class="listview-image" MaxHeight="100" Source="{x:Bind ImageLocation}" Stretch="Fill" />
                      <StackPanel Grid.Column="1" Margin="12,0,0,0">
                      <TextBlock Margin="0,0,0,6" FontSize="14" FontWeight="SemiBold" LineHeight="20" Text="{x:Bind Title}" />
                      <TextBlock class="listview-image-description" Width="350" MaxHeight="60" Margin="0,0,0,10" FontFamily="Segoe UI" FontWeight="Normal" Text="{x:Bind Description}" TextTrimming="CharacterEllipsis" TextWrapping="Wrap" />
                      <StackPanel class="listview-image-stats" Orientation="Horizontal">
                        <TextBlock class="listview-image-caption" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind Views}" /><TextBlock class="listview-image-caption" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind $t('sample.listview.views'), Mode=OneWay}" /><TextBlock class="listview-image-caption" Style="{StaticResource CaptionTextBlockStyle}" Text=" · " />
                        <TextBlock class="listview-image-caption" Style="{StaticResource CaptionTextBlockStyle}" Margin="5,0,0,0" Text="{x:Bind Likes}" /><TextBlock class="listview-image-caption" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind $t('sample.listview.likes'), Mode=OneWay}" />
                      </StackPanel>
                    </StackPanel>
                  </Grid>
                </DataTemplate>
              </ListView.ItemTemplate>
            </ListView>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample class="listview-context-example" HeaderText="{x:Bind $t('sample.listview.context-menus'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind contextXaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind $t('sample.listview.context-note'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView class="listview-context-control" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind contextContacts, Mode=OneWay}" SelectionMode="Single" ShowsScrollingPlaceholders="True" BorderThickness="1" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}">
                <ListView.ItemTemplate>
                  <DataTemplate>
                    <Grid class="listview-contact-template">
                      <Grid.ContextFlyout><MenuFlyout><MenuFlyoutItem Text="{x:Bind $t('sample.delete'), Mode=OneWay}" Click="deleteContact" /></MenuFlyout></Grid.ContextFlyout>
                      <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                    <Border class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" CornerRadius="16" HorizontalAlignment="Center" VerticalAlignment="Center" Background="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                      <TextBlock Grid.Column="1" Margin="12,6,0,0" Text="{x:Bind Name}" />
                      <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" Text="{x:Bind Company}" />
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import ListView from '../../components/ListView.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import TextBox from '../../components/TextBox.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'listview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const contacts = ref([
  { FirstName: 'Kendall', LastName: 'Collins', Name: 'Kendall Collins', Company: 'Adatum Corporation' },
  { FirstName: 'Henry', LastName: 'Ross', Name: 'Henry Ross', Company: 'Adventure Works Cycles' },
  { FirstName: 'Vance', LastName: 'DeLeon', Name: 'Vance DeLeon', Company: 'Alpine Ski House' },
  { FirstName: 'Victoria', LastName: 'Burke', Name: 'Victoria Burke', Company: 'Bellows College' },
  { FirstName: 'Amber', LastName: 'Rodriguez', Name: 'Amber Rodriguez', Company: 'Best For You Organics Company' },
  { FirstName: 'Amari', LastName: 'Rivera', Name: 'Amari Rivera', Company: 'Contoso, Ltd.' },
  { FirstName: 'Jessie', LastName: 'Irwin', Name: 'Jessie Irwin', Company: 'Contoso Pharmaceuticals' },
  { FirstName: 'Quinn', LastName: 'Campbell', Name: 'Quinn Campbell', Company: 'Contoso Suites' },
  { FirstName: 'Olivia', LastName: 'Wilson', Name: 'Olivia Wilson', Company: 'Consolidated Messenger' },
  { FirstName: 'Ana', LastName: 'Bowman', Name: 'Ana Bowman', Company: 'Fabrikam, Inc.' },
  { FirstName: 'Shawn', LastName: 'Hughes', Name: 'Shawn Hughes', Company: 'Fabrikam Residences' },
  { FirstName: 'Oscar', LastName: 'Ward', Name: 'Oscar Ward', Company: 'First Up Consultants' },
  { FirstName: 'Madison', LastName: 'Butler', Name: 'Madison Butler', Company: 'Fourth Coffee' },
  { FirstName: 'Graham', LastName: 'Barnes', Name: 'Graham Barnes', Company: 'Graphic Design Institute' },
  { FirstName: 'Anthony', LastName: 'Ivanov', Name: 'Anthony Ivanov', Company: 'Humongous Insurance' },
  { FirstName: 'Michael', LastName: 'Peltier', Name: 'Michael Peltier', Company: 'Lamna Healthcare Company' },
  { FirstName: 'Morgan', LastName: 'Connors', Name: 'Morgan Connors', Company: "Liberty's Delightful Sinful Bakery & Cafe" },
  { FirstName: 'Andre', LastName: 'Lawson', Name: 'Andre Lawson', Company: 'Lucerne Publishing' },
  { FirstName: 'Preston', LastName: 'Morales', Name: 'Preston Morales', Company: "Margie's Travel" },
  { FirstName: 'Briana', LastName: 'Hernandez', Name: 'Briana Hernandez', Company: 'Nod Publishers' },
  { FirstName: 'Nicole', LastName: 'Wagner', Name: 'Nicole Wagner', Company: 'Northwind Traders' },
  { FirstName: 'Mario', LastName: 'Rogers', Name: 'Mario Rogers', Company: 'Proseware, Inc.' },
  { FirstName: 'Eugenia', LastName: 'Lopez', Name: 'Eugenia Lopez', Company: 'Relecloud' },
  { FirstName: 'Nathan', LastName: 'Rigby', Name: 'Nathan Rigby', Company: 'School of Fine Art' },
  { FirstName: 'Ellis', LastName: 'Turner', Name: 'Ellis Turner', Company: 'Southridge Video' },
  { FirstName: 'Miguel', LastName: 'Reyes', Name: 'Miguel Reyes', Company: 'Tailspin Toys' },
  { FirstName: 'Hayden', LastName: 'Cook', Name: 'Hayden Cook', Company: 'Tailwind Traders' }
])
const contextContacts = ref(contacts.value.map((contact) => ({ ...contact })))
const groups = computed(() => {
  const grouped = new Map()
  for (const contact of contacts.value) {
    const key = contact.LastName.charAt(0).toUpperCase()
    const current = grouped.get(key) ?? []
    current.push(contact)
    grouped.set(key, current)
  }
  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([Key, Items]) => ({ Key, Items }))
})

const filterText = ref('')
const filterLastName = ref('')
const filterCompany = ref('')
const filteredContacts = computed(() => contacts.value.filter((item) => {
  const [firstName, ...lastName] = item.Name.toLowerCase().split(' ')
  return (!filterText.value || firstName.includes(filterText.value.toLowerCase()))
    && (!filterLastName.value || lastName.join(' ').includes(filterLastName.value.toLowerCase()))
    && (!filterCompany.value || item.Company.toLowerCase().includes(filterCompany.value.toLowerCase()))
}))

const selectionModes = computed(() => [{ Value: 'None', Text: t('text.none') }, { Value: 'Single', Text: t('text.single') }, { Value: 'Multiple', Text: t('text.multiple') }, { Value: 'Extended', Text: t('text.extended') }])
const selectionModeOptions = computed(() => selectionModes.value.map(({ Value }) => ({ Value, Text: t(`sample.selection-${Value.toLowerCase()}`) })))
const selectionModeIndex = ref(1)
const selectionMode = computed(() => selectionModes.value[selectionModeIndex.value]?.Value || 'Single')

const dragLeft = ref([...contacts.value])
const dragRight = ref([
  { FirstName: 'John', LastName: 'Doe', Name: 'John Doe', Company: 'ABC Printers' },
  { FirstName: 'Jane', LastName: 'Doe', Name: 'Jane Doe', Company: 'XYZ Refrigerators' },
  { FirstName: 'Santa', LastName: 'Claus', Name: 'Santa Claus', Company: 'North Pole Toy Factory Inc.' }
])
const activeDrag = ref(null)
const beginDragLeft = (args) => { activeDrag.value = { side: 'left', items: args?.Items || [] } }
const beginDragRight = (args) => { activeDrag.value = { side: 'right', items: args?.Items || [] } }
const endDrag = () => { activeDrag.value = null }
const dragOverLeft = () => {}
const dragOverRight = () => {}
const drop = (side, args) => {
  if (!activeDrag.value || activeDrag.value.side === side) return
  const source = activeDrag.value.side === 'left' ? dragLeft : dragRight
  const target = side === 'left' ? dragLeft : dragRight
  const moved = activeDrag.value.items
  source.value = source.value.filter(item => !moved.includes(item))
  const insertIndex = Math.max(0, Math.min(Number(args?.InsertIndex ?? target.value.length), target.value.length))
  const nextTarget = [...target.value]
  nextTarget.splice(insertIndex, 0, ...moved)
  target.value = nextTarget
  activeDrag.value = null
}
const dropLeft = (args) => drop('left', args)
const dropRight = (args) => drop('right', args)

const stickyOn = ref(false)
let messageNumber = 0
const makeMessage = (alignment) => ({
  MsgText: t('sample.listview.message-number', { count: ++messageNumber }),
  MsgDateTime: new Date().toLocaleString(),
  MsgAlignment: alignment
})
const messages = ref([makeMessage('Right')])
const appendMessage = (alignment) => {
  messages.value.push(makeMessage(alignment))
}
const sendMessage = () => appendMessage('Right')
const receiveMessage = () => appendMessage('Left')
const messageOutput = computed(() => t('sample.listview.message-count', { count: messages.value.length }))

const mediaBase = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const imageItems = Array.from({ length: 8 }, (_, index) => ({
  Title: t('sample.listview.image-item', { index: index + 1 }),
  ImageLocation: `${mediaBase}/LandscapeImage${index + 1}.jpg`,
  Views: String(100 + index * 37),
  Likes: String(10 + index * 11),
  Description: t('sample.listview.image-description', { index: index + 1 })
}))

const deleteContact = (args) => {
  const item = args?.ClickedItem ?? args?.DataContext ?? args?.item?.DataContext
  if (item) contextContacts.value = contextContacts.value.filter((contact) => contact !== item)
}

const basicXaml = '<ListView Width="350" Height="400" HorizontalAlignment="Left" BorderThickness="1" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" ItemTemplate="{StaticResource BasicListViewTemplate}" />'
const selectionXaml = '<ListView Width="400" Height="400" SelectionMode="{x:Bind SelectionMode}" ItemTemplate="{StaticResource ContactListViewTemplate}" />'
const dragXaml = '<Grid><Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="Auto" /></Grid.RowDefinitions><Grid.ColumnDefinitions><ColumnDefinition Width="1*" /><ColumnDefinition Width="1*" /></Grid.ColumnDefinitions><ListView Grid.Row="1" Grid.Column="0" Height="400" MinWidth="350" Margin="12" CanDragItems="True" CanReorderItems="True" AllowDrop="True" SelectionMode="Single" /><ListView Grid.Row="1" Grid.Column="1" Height="400" MinWidth="350" CanDragItems="True" CanReorderItems="True" AllowDrop="True" SelectionMode="Single" /></Grid>'
const groupedXaml = '<CollectionViewSource x:Name="ContactsCVS" IsSourceGrouped="True" /><ListView Width="400" Height="400" ItemsSource="{x:Bind ContactsCVS.View, Mode=OneWay}"><ListView.ItemsPanel><ItemsPanelTemplate><ItemsStackPanel AreStickyGroupHeadersEnabled="{x:Bind AreStickyGroupHeadersEnabled}" /></ItemsPanelTemplate></ListView.ItemsPanel><ListView.GroupStyle><GroupStyle><GroupStyle.HeaderTemplate><DataTemplate x:DataType="local:GroupInfoList"><Border AutomationProperties.AccessibilityView="Raw"><TextBlock AutomationProperties.AccessibilityView="Raw" Style="{ThemeResource TitleTextBlockStyle}" Text="{x:Bind Key}" /></Border></DataTemplate></GroupStyle.HeaderTemplate></GroupStyle></ListView.GroupStyle></ListView>'
const filteringXaml = '<ListView Width="400" Height="400" ItemsSource="{x:Bind FilteredContacts}" SelectionMode="Single" ItemTemplate="{StaticResource ContactListViewTemplate}" />'
const messagingXaml = '<ListView Height="400" ItemsSource="{x:Bind Messages, Mode=OneWay}" SelectionMode="None"><ListView.ItemsPanel><ItemsPanelTemplate><ItemsStackPanel VerticalAlignment="Bottom" ItemsUpdatingScrollMode="KeepLastItemInView" /></ItemsPanelTemplate></ListView.ItemsPanel><ListView.ItemContainerStyle><Style TargetType="ListViewItem"><Setter Property="HorizontalContentAlignment" Value="Stretch" /></Style></ListView.ItemContainerStyle><ListView.ItemTemplate><DataTemplate x:DataType="local:Message"><Grid Height="Auto" Margin="4" HorizontalAlignment="{x:Bind MsgAlignment}"><StackPanel Width="350" MinHeight="75" Padding="10,0,0,10" /></Grid></DataTemplate></ListView.ItemTemplate></ListView>'
const imagesXaml = '<ListView Height="400" MinWidth="550" ItemsSource="{x:Bind Items, Mode=OneWay}"><ListView.ItemTemplate><DataTemplate x:DataType="local:CustomDataObject"><Grid Margin="0,12,0,12"><Grid.ColumnDefinitions><ColumnDefinition Width="Auto" MinWidth="150" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions><Image MaxHeight="100" Source="{x:Bind ImageLocation}" Stretch="Fill" /><StackPanel Grid.Column="1" Margin="12,0,0,0"><TextBlock Text="{x:Bind Title}" /><TextBlock Width="350" MaxHeight="60" Text="{x:Bind Description}" TextTrimming="CharacterEllipsis" TextWrapping="Wrap" /></StackPanel></Grid></DataTemplate></ListView.ItemTemplate></ListView>'
const contextXaml = computed(() => `<ListView Width="400" Height="400" SelectionMode="Single"><ListView.ItemTemplate><DataTemplate><Grid><Grid.ContextFlyout><MenuFlyout><MenuFlyoutItem Text="${t('sample.delete')}" Click="ContactDeleteMenuItem_Click" /></MenuFlyout></Grid.ContextFlyout><Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions></Grid></DataTemplate></ListView.ItemTemplate></ListView>`)
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }

/* The contact template is shared by the selection, grouped, filtering, and
   context-menu samples in the WinUI Gallery. Keep its two-row grid and avatar
   lane identical in each list so the presenter can add selection chrome
   without shifting the content. */
.listview-selection-example :deep(.listview-contact-template),
.listview-grouped-example :deep(.listview-contact-template),
.listview-filtering-example :deep(.listview-contact-template),
.listview-context-example :deep(.listview-contact-template),
.listview-drag-source :deep(.listview-contact-template),
.listview-drag-target :deep(.listview-contact-template) {
  width: 100%;
  min-width: 0;
  min-height: 52px;
  box-sizing: border-box;
}

.listview-selection-example :deep(.listview-contact-avatar),
.listview-grouped-example :deep(.listview-contact-avatar),
.listview-filtering-example :deep(.listview-contact-avatar),
.listview-context-example :deep(.listview-contact-avatar),
.listview-drag-source :deep(.listview-contact-avatar),
.listview-drag-target :deep(.listview-contact-avatar) {
  align-self: center;
  justify-self: center;
  flex: 0 0 auto;
}

.listview-selection-example :deep(.listview-contact-template > .win-text-block),
.listview-grouped-example :deep(.listview-contact-template > .win-text-block),
.listview-filtering-example :deep(.listview-contact-template > .win-text-block),
.listview-context-example :deep(.listview-contact-template > .win-text-block),
.listview-drag-source :deep(.listview-contact-template > .win-text-block),
.listview-drag-target :deep(.listview-contact-template > .win-text-block) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Keep the filtering and context-menu examples inside their display column;
   their operation panes must never become part of the list's measured width. */
.listview-filtering-example :deep(.example-display),
.listview-context-example :deep(.example-display) {
  min-width: 0;
  overflow: auto;
}

.listview-filtering-example :deep(.listview-filtering-control),
.listview-context-example :deep(.listview-context-control) {
  flex: 0 0 400px;
  max-width: 100%;
  min-width: 0;
}

.listview-filtering-example :deep(.example-options) {
  min-width: 0;
  overflow: hidden;
}

.gallery-page-content :deep(.listview-drag-description) {
  min-width: 0;
  max-width: 100%;
}

.listview-drag-source,
.listview-drag-target {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.listview-drag-source :deep(.win-list-content),
.listview-drag-target :deep(.win-list-content) {
  overscroll-behavior: contain;
}

/* The image template's first column is Auto/MinWidth=150 in Gallery. The
   web image host has no intrinsic XAML measure, so constrain its host and
   bitmap to that same 150x100 box and clip at the ListView content edge. */
.listview-images-example :deep(.listview-images-control) {
  max-width: 100%;
  min-width: min(550px, 100%) !important;
}

.listview-images-example :deep(.win-list-content) {
  overflow-x: hidden;
}

.listview-images-example :deep(.listview-image-item) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  grid-template-columns: 150px minmax(0, 1fr) !important;
}

.listview-images-example :deep(.listview-image) {
  display: block;
  width: 150px;
  height: 100px;
  max-width: 150px;
  max-height: 100px;
  overflow: hidden;
  align-self: start;
  justify-self: start;
  box-sizing: border-box;
  object-fit: fill;
}

.listview-images-example :deep(.listview-image .win-image) {
  display: block;
  width: 150px !important;
  height: 100px !important;
  max-width: 150px !important;
  max-height: 100px !important;
  object-fit: fill;
}

.listview-images-example :deep(.win-list-item-content) {
  overflow: hidden;
}

.listview-images-example :deep(.listview-image-item > .win-stack-panel) {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.listview-images-example :deep(.listview-image-description) {
  width: 350px;
  max-width: 100%;
  max-height: 60px;
  overflow: hidden;
  box-sizing: border-box;
}

.listview-images-example :deep(.listview-image-stats) {
  min-width: 0;
  align-items: baseline;
}

.listview-images-example :deep(.listview-image-caption) {
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  font-size: 12px;
  line-height: 16px;
}

/* Prevent long sample notes from participating in the adjacent options or
   output column's intrinsic width. */
.gallery-page-content :deep(.control-example-root),
.gallery-page-content :deep(.example-container),
.gallery-page-content :deep(.example-display) {
  min-width: 0;
}

@media (max-width: 739px) {
  .listview-images-example :deep(.listview-images-control) {
    min-width: 0 !important;
  }

  .listview-images-example :deep(.listview-image-item) {
    grid-template-columns: 120px minmax(0, 1fr);
  }

  .listview-images-example :deep(.listview-image),
  .listview-images-example :deep(.listview-image .win-image) {
    width: 120px;
    max-width: 120px;
  }

  .listview-images-example :deep(.listview-image .win-image) {
    width: 120px !important;
    height: 100px !important;
    max-width: 120px !important;
    max-height: 100px !important;
  }
}
</style>
