<template>
  <Page>
    <Page.Resources>
      <DataTemplate x:Key="ImageTextListMailFolderTemplate" x:DataType="models:ControlInfoDataItem">
        <Grid Margin="0,12,0,12">
          <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" MinWidth="550" /></Grid.ColumnDefinitions>
          <TextBlock Margin="0,12,0,0" HorizontalAlignment="Left" Text="{x:Bind Title}" TextWrapping="Wrap" />
        </Grid>
      </DataTemplate>
      <CollectionViewSource x:Name="ContactsCVS" IsSourceGrouped="True" Source="{x:Bind groups, Mode=OneWay}" />
      <DataTemplate x:Key="ContactListViewTemplate" x:DataType="local:Contact">
        <Grid class="listview-contact-template">
          <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
          <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
          <Ellipse x:Name="Ellipse" class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="{ThemeResource ControlStrongFillColorDefaultBrush}" />
          <TextBlock Grid.Column="1" Margin="12,6,0,0" x:Phase="1" Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind Name}" />
          <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" x:Phase="2" Style="{ThemeResource BodyTextBlockStyle}" Text="{x:Bind Company}" />
        </Grid>
      </DataTemplate>
      <DataTemplate x:Key="MessageViewTemplate" x:DataType="local:Message">
        <Grid Height="Auto" Margin="4" HorizontalAlignment="{x:Bind MsgAlignment}">
          <StackPanel Width="350" MinHeight="75" Padding="10,0,0,10" Background="{ThemeResource SystemColorHighlightColor}" CornerRadius="{StaticResource ControlCornerRadius}">
            <TextBlock Padding="0,10,0,0" FontSize="20" Foreground="{ThemeResource SystemColorHighlightTextColor}" Text="{x:Bind MsgText}" />
            <TextBlock Padding="0,0,0,10" FontSize="15" Foreground="{ThemeResource SystemColorHighlightTextColor}" Text="{x:Bind MsgDateTime}" />
          </StackPanel>
        </Grid>
      </DataTemplate>
      <DataTemplate x:Key="BasicListViewTemplate" x:DataType="local:Contact">
        <TextBlock Margin="0,5,0,5" x:Phase="1" Text="{x:Bind Name}" />
      </DataTemplate>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind Labels.BasicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind basicXaml, Mode=OneWay}" CSharp="{x:Bind basicCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,16" Text="{x:Bind Labels.BasicNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView x:Name="BaseExample" Width="350" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind contacts, Mode=OneWay}" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" ItemTemplate="{StaticResource BasicListViewTemplate}" />
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample class="listview-selection-example" HeaderText="{x:Bind Labels.SelectionHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind selectionXaml, Mode=OneWay}" CSharp="{x:Bind selectionCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <RichTextBlock Margin="0,0,0,15" TextWrapping="Wrap">
                <Paragraph><Run Text="{x:Bind Labels.SelectionIntroduction, Mode=OneWay}" /></Paragraph>
                <Paragraph><Bold><Run Text="{x:Bind Labels.SelectionNone, Mode=OneWay}" /></Bold><Run Text="{x:Bind Labels.SelectionNoneDescription, Mode=OneWay}" /></Paragraph>
                <Paragraph><Bold><Run Text="{x:Bind Labels.SelectionSingle, Mode=OneWay}" /></Bold><Run Text="{x:Bind Labels.SelectionSingleDescription, Mode=OneWay}" /></Paragraph>
                <Paragraph><Bold><Run Text="{x:Bind Labels.SelectionMultiple, Mode=OneWay}" /></Bold><Run Text="{x:Bind Labels.SelectionMultipleDescription, Mode=OneWay}" /></Paragraph>
                <Paragraph><Bold><Run Text="{x:Bind Labels.SelectionExtended, Mode=OneWay}" /></Bold><Run Text="{x:Bind Labels.SelectionExtendedDescription, Mode=OneWay}" /></Paragraph>
              </RichTextBlock>
              <ListView x:Name="Control2" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind contacts, Mode=OneWay}" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" SelectionMode="{x:Bind selectionMode, Mode=OneWay}" ItemTemplate="{StaticResource ContactListViewTemplate}" />
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel><ComboBox Margin="0,12,0,0" Header="{x:Bind selectionModeLabel, Mode=OneWay}" ItemsSource="{x:Bind selectionModeOptions, Mode=OneWay}" DisplayMemberPath="Text" SelectedIndex="{x:Bind selectionModeIndex, Mode=TwoWay}" /></StackPanel>
          </ControlExample.Options>
          <ControlExample.Substitutions>
            <ControlExampleSubstitution Key="SelectionMode" Value="{x:Bind selectionMode, Mode=OneWay}" />
          </ControlExample.Substitutions>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind Labels.DragHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind dragXaml, Mode=OneWay}" CSharp="{x:Bind dragCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <Grid class="listview-drag-grid">
              <Grid.RowDefinitions><RowDefinition Height="Auto" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
              <Grid.ColumnDefinitions><ColumnDefinition Width="1*" /><ColumnDefinition Width="1*" /></Grid.ColumnDefinitions>
              <TextBlock class="listview-drag-description" Style="{StaticResource BodyTextBlockStyle}" Text="{x:Bind Labels.DragNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView x:Name="DragDropListView" class="listview-drag-source" Grid.Row="1" Grid.Column="0" ItemsSource="{x:Bind dragLeft, Mode=TwoWay}" Height="400" MinWidth="350" Margin="12" SelectionMode="Single" CanDragItems="True" CanReorderItems="True" AllowDrop="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" DragItemsStarting="beginDragLeft" DragItemsCompleted="endDrag" DragOver="dragOverLeft" Drop="dropLeft" ItemTemplate="{StaticResource ContactListViewTemplate}" />
              <ListView x:Name="DragDropListView2" class="listview-drag-target" Grid.Row="1" Grid.Column="1" ItemsSource="{x:Bind dragRight, Mode=TwoWay}" Height="400" MinWidth="350" SelectionMode="Single" CanDragItems="True" CanReorderItems="True" AllowDrop="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" DragItemsStarting="beginDragRight" DragItemsCompleted="endDrag" DragOver="dragOverRight" Drop="dropRight" ItemTemplate="{StaticResource ContactListViewTemplate}" />
            </Grid>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample class="listview-grouped-example" HeaderText="{x:Bind Labels.GroupedHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind groupedXaml, Mode=OneWay}" CSharp="{x:Bind groupedCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind Labels.GroupedNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView x:Name="GroupedListViewCtrl" class="listview-grouped-control" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind ContactsCVS.View, Mode=OneWay}" SelectionMode="Single" ShowsScrollingPlaceholders="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" ItemTemplate="{StaticResource ContactListViewTemplate}">
                <ListView.ItemsPanel><ItemsPanelTemplate><ItemsStackPanel x:Name="GroupedStackPanel" AreStickyGroupHeadersEnabled="{x:Bind stickyOn, Mode=OneWay}" /></ItemsPanelTemplate></ListView.ItemsPanel>
                <ListView.GroupStyle>
                  <GroupStyle>
                    <GroupStyle.HeaderTemplate><DataTemplate x:DataType="local:GroupInfoList"><Border AutomationProperties.AccessibilityView="Raw"><TextBlock AutomationProperties.AccessibilityView="Raw" Style="{ThemeResource TitleTextBlockStyle}" Text="{x:Bind Key}" /></Border></DataTemplate></GroupStyle.HeaderTemplate>
                  </GroupStyle>
                </ListView.GroupStyle>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options><StackPanel><ToggleSwitch x:Name="StickySwitch" Header="{x:Bind Labels.StickyHeaders, Mode=OneWay}" IsOn="{x:Bind stickyOn, Mode=TwoWay}" /></StackPanel></ControlExample.Options>
          <ControlExample.Substitutions>
            <ControlExampleSubstitution Key="AreStickyGroupHeadersEnabled" Value="{x:Bind stickyOn, Mode=OneWay}" />
          </ControlExample.Substitutions>
        </ControlExample>

        <ControlExample class="listview-filtering-example" HeaderText="{x:Bind Labels.FilteringHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind filteringXaml, Mode=OneWay}" CSharp="{x:Bind filteringCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <ListView x:Name="FilteredListView" class="listview-filtering-control" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind filteredContacts, Mode=OneWay}" SelectionMode="Single" ShowsScrollingPlaceholders="True" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" ItemTemplate="{StaticResource ContactListViewTemplate}" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel Width="200">
              <TextBlock Margin="8,8,8,4" Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind Labels.FilterBy, Mode=OneWay}" />
              <TextBox x:Name="FilterByFirstName" HorizontalAlignment="Stretch" Margin="8" Header="{x:Bind Labels.FirstName, Mode=OneWay}" Text="{x:Bind filterText, Mode=TwoWay}" />
              <TextBox x:Name="FilterByLastName" HorizontalAlignment="Stretch" Margin="8" Header="{x:Bind Labels.LastName, Mode=OneWay}" Text="{x:Bind filterLastName, Mode=TwoWay}" />
              <TextBox x:Name="FilterByCompany" HorizontalAlignment="Stretch" Margin="8" Header="{x:Bind Labels.Company, Mode=OneWay}" Text="{x:Bind filterCompany, Mode=TwoWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample class="listview-messaging-example" HeaderText="{x:Bind Labels.MessagingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind messagingXaml, Mode=OneWay}" CSharp="{x:Bind messagingCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind Labels.MessagingNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView x:Name="InvertedListView" Height="400" ItemsSource="{x:Bind messages, Mode=OneWay}" SelectionMode="None" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" ItemTemplate="{StaticResource MessageViewTemplate}">
                <ListView.ItemsPanel><ItemsPanelTemplate><ItemsStackPanel VerticalAlignment="Bottom" ItemsUpdatingScrollMode="KeepLastItemInView" /></ItemsPanelTemplate></ListView.ItemsPanel>
                <ListView.ItemContainerStyle><Style TargetType="ListViewItem"><Setter Property="HorizontalContentAlignment" Value="Stretch" /></Style></ListView.ItemContainerStyle>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Text="{x:Bind messageOutput, Mode=OneWay}" /></ControlExample.Output>
          <ControlExample.Options>
            <StackPanel HorizontalAlignment="Right">
              <Button Margin="0,0,0,10" Content="{x:Bind sendMessageLabel, Mode=OneWay}" Click="sendMessage" />
              <Button Content="{x:Bind receiveMessageLabel, Mode=OneWay}" Click="receiveMessage" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample class="listview-images-example" HeaderText="{x:Bind Labels.ImagesHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind imagesXaml, Mode=OneWay}" CSharp="{x:Bind imagesCSharp, Mode=OneWay}">
          <ControlExample.Example>
              <ListView x:Name="Control4" class="listview-images-control" Height="400" MinWidth="550" ItemsSource="{x:Bind imageItems, Mode=TwoWay}" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}" BorderThickness="1" AllowDrop="True" CanDrag="True" CanDragItems="True" CanReorderItems="True">
                <ListView.ItemTemplate>
                  <DataTemplate x:DataType="local:CustomDataObject">
                    <Grid class="listview-image-item" Margin="0,12,0,12" AutomationProperties.Name="{x:Bind Title}">
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" MinWidth="150" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Image class="listview-image" MaxHeight="100" Source="{x:Bind ImageLocation}" Stretch="Fill" />
                      <StackPanel Grid.Column="1" Margin="12,0,0,0">
                      <TextBlock Margin="0,0,0,6" HorizontalAlignment="Left" FontSize="14" FontWeight="SemiBold" LineHeight="20" Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind Title}" />
                      <TextBlock class="listview-image-description" Width="350" MaxHeight="60" Margin="0,0,0,10" FontFamily="Segoe UI" FontWeight="Normal" IsTextTrimmedChanged="TextBlock_IsTextTrimmedChanged" Style="{ThemeResource BodyTextBlockStyle}" Text="{x:Bind Description}" TextTrimming="CharacterEllipsis" TextWrapping="Wrap" />
                      <StackPanel class="listview-image-stats" Orientation="Horizontal">
                        <TextBlock class="listview-image-caption" Margin="0" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Views}" /><TextBlock class="listview-image-caption" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Labels.Views, Mode=OneWay}" /><TextBlock class="listview-image-caption" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Labels.StatsSeparator, Mode=OneWay}" />
                        <TextBlock class="listview-image-caption" Style="{ThemeResource CaptionTextBlockStyle}" Margin="5,0,0,0" Text="{x:Bind Likes}" /><TextBlock class="listview-image-caption" Style="{ThemeResource CaptionTextBlockStyle}" Text="{x:Bind Labels.Likes, Mode=OneWay}" />
                      </StackPanel>
                    </StackPanel>
                  </Grid>
                </DataTemplate>
              </ListView.ItemTemplate>
            </ListView>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample class="listview-context-example" HeaderText="{x:Bind Labels.ContextHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind contextXaml, Mode=OneWay}" CSharp="{x:Bind contextCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,15" Text="{x:Bind Labels.ContextNote, Mode=OneWay}" TextWrapping="WrapWholeWords" />
              <ListView x:Name="ContextMenuList" class="listview-context-control" Width="400" Height="400" HorizontalAlignment="Left" ItemsSource="{x:Bind contextContacts, Mode=OneWay}" SelectionMode="Single" ShowsScrollingPlaceholders="True" BorderThickness="1" BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}">
                <ListView.ItemTemplate>
                  <DataTemplate x:DataType="local:Contact">
                    <Grid class="listview-contact-template">
                      <Grid.ContextFlyout><MenuFlyout><MenuFlyoutItem Text="{x:Bind Labels.Delete, Mode=OneWay}" Click="deleteContact" /></MenuFlyout></Grid.ContextFlyout>
                      <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="*" /></Grid.RowDefinitions>
                      <Grid.ColumnDefinitions><ColumnDefinition Width="Auto" /><ColumnDefinition Width="*" /></Grid.ColumnDefinitions>
                      <Ellipse x:Name="Ellipse" class="listview-contact-avatar" Grid.RowSpan="2" Width="32" Height="32" Margin="6" HorizontalAlignment="Center" VerticalAlignment="Center" Fill="{ThemeResource ControlStrongFillColorDefaultBrush}" />
                      <TextBlock Grid.Column="1" Margin="12,6,0,0" x:Phase="1" Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind Name}" />
                      <TextBlock Grid.Row="1" Grid.Column="1" Margin="12,0,0,6" x:Phase="2" Style="{ThemeResource BodyTextBlockStyle}" Text="{x:Bind Company}" />
                    </Grid>
                  </DataTemplate>
                </ListView.ItemTemplate>
              </ListView>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import ListView from '../../components/ListView.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import TextBox from '../../components/TextBox.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import Page from '../../components/Page.vue'
import Ellipse from '../../components/Ellipse.vue'
import RichTextBlock from '../../components/RichTextBlock.vue'
import CollectionViewSource from '../../components/CollectionViewSource'
import { Bold, Paragraph, Run } from '../../components/TextInline'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'
import basicSampleDefinition from '../samples/ListView/BasicListviewSimpleDatatemplate.txt?raw'
import selectionSampleDefinition from '../samples/ListView/ListviewSelectionSupport.txt?raw'
import dragSampleDefinition from '../samples/ListView/ListviewsDragDropReordering.txt?raw'
import groupedSampleDefinition from '../samples/ListView/ListviewGroupedHeaders.txt?raw'
import filteringSampleDefinition from '../samples/ListView/ListviewFiltering.txt?raw'
import messagingSampleDefinition from '../samples/ListView/ListviewMessagingDataLogging.txt?raw'
import imagesSampleDefinition from '../samples/ListView/ListviewImages.txt?raw'
import contextSampleDefinition from '../samples/ListView/ListviewContextMenus.txt?raw'

const { t } = useI18n()
const Labels = computed(() => ({
  Title: t('text.listview'),
  Description: t('text.a-listview-displays-data-in-a-vertical-list-with'),
  BasicHeader: t('sample.listview.basic-simple-datatemplate'),
  BasicNote: t('sample.listview.basic-note'),
  SelectionHeader: t('sample.listview.selection-support'),
  SelectionNote: t('sample.listview.selection-note'),
  SelectionIntroduction: t('sample.listview.selection-introduction'),
  SelectionNone: t('sample.selection-none'),
  SelectionSingle: t('sample.selection-single'),
  SelectionMultiple: t('sample.selection-multiple'),
  SelectionExtended: t('sample.selection-extended'),
  SelectionNoneDescription: t('sample.listview.selection-none-description'),
  SelectionSingleDescription: t('sample.listview.selection-single-description'),
  SelectionMultipleDescription: t('sample.listview.selection-multiple-description'),
  SelectionExtendedDescription: t('sample.listview.selection-extended-description'),
  DragHeader: t('sample.listview.drag-drop-reordering'),
  DragNote: t('sample.listview.drag-drop-note'),
  GroupedHeader: t('sample.listview.grouped-headers'),
  GroupedNote: t('sample.listview.grouped-note'),
  StickyHeaders: t('sample.sticky-headers'),
  FilteringHeader: t('sample.listview.filtering'),
  FilterBy: t('sample.filter-by'),
  FirstName: t('sample.listview.first-name'),
  LastName: t('sample.listview.last-name'),
  Company: t('sample.listview.company'),
  MessagingHeader: t('sample.listview.messaging'),
  MessagingNote: t('sample.listview.messaging-note'),
  ImagesHeader: t('sample.listview.images'),
  Views: t('sample.listview.views'),
  Likes: t('sample.listview.likes'),
  StatsSeparator: t('sample.listview.stats-separator'),
  ContextHeader: t('sample.listview.context-menus'),
  ContextNote: t('sample.listview.context-note'),
  Delete: t('sample.delete')
}))
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
const selectionModeLabel = computed(() => t('sample.selection-mode'))
const selectionModeIndex = ref(1)
const selectionMode = computed(() => selectionModes.value[selectionModeIndex.value]?.Value || 'Single')

const dragLeft = ref([...contacts.value])
const dragRight = ref([
  { FirstName: 'John', LastName: 'Doe', Name: 'John Doe', Company: 'ABC Printers' },
  { FirstName: 'Jane', LastName: 'Doe', Name: 'Jane Doe', Company: 'XYZ Refrigerators' },
  { FirstName: 'Santa', LastName: 'Claus', Name: 'Santa Claus', Company: 'North Pole Toy Factory Inc.' }
])
const activeDrag = ref(null)
const beginDragLeft = (_sender, args) => { activeDrag.value = { side: 'left', items: args?.Items || [] } }
const beginDragRight = (_sender, args) => { activeDrag.value = { side: 'right', items: args?.Items || [] } }
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
const dropLeft = (_sender, args) => drop('left', args)
const dropRight = (_sender, args) => drop('right', args)

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
const sendMessageLabel = computed(() => t('sample.listview.send-message'))
const receiveMessageLabel = computed(() => t('sample.listview.receive-message'))
const messageOutput = computed(() => t('sample.listview.message-count', { count: messages.value.length }))

const mediaBase = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia'
const imageDescriptionKeys = [
  'sample.listview.image-description-1', 'sample.listview.image-description-2',
  'sample.listview.image-description-3', 'sample.listview.image-description-4',
  'sample.listview.image-description-5', 'sample.listview.image-description-6',
  'sample.listview.image-description-7', 'sample.listview.image-description-8'
]
const imageItems = ref(Array.from({ length: 8 }, (_, index) => ({
  Title: t('sample.listview.image-item', { index: index + 1 }),
  ImageLocation: `${mediaBase}/LandscapeImage${index + 1}.jpg`,
  Views: String(100 + index * 37),
  Likes: String(10 + index * 11),
  Description: t(imageDescriptionKeys[index])
})))

const deleteContact = (sender, _args) => {
  const item = sender?.DataContext
  if (item) contextContacts.value = contextContacts.value.filter((contact) => contact !== item)
}
const TextBlock_IsTextTrimmedChanged = (sender, _args) => {
  const element = sender?.Element?.value ?? sender?.Element
  if (!(element instanceof HTMLElement)) return
  if (sender.IsTextTrimmed) element.setAttribute('ToolTipService.ToolTip', element.textContent ?? '')
  else element.removeAttribute('ToolTipService.ToolTip')
}

const sourcePart = (definition, section) => definition
  .split(new RegExp(`^--- ${section}\\s*$`, 'm'))[1]?.split(/^--- /m)[0].trim() ?? ''
const basicXaml = sourcePart(basicSampleDefinition, 'xaml')
const basicCSharp = sourcePart(basicSampleDefinition, 'c#')
const selectionXaml = sourcePart(selectionSampleDefinition, 'xaml')
const selectionCSharp = sourcePart(selectionSampleDefinition, 'c#')
const dragXaml = sourcePart(dragSampleDefinition, 'xaml')
const dragCSharp = sourcePart(dragSampleDefinition, 'c#')
const groupedXaml = sourcePart(groupedSampleDefinition, 'xaml')
const groupedCSharp = sourcePart(groupedSampleDefinition, 'c#')
const filteringXaml = sourcePart(filteringSampleDefinition, 'xaml')
const filteringCSharp = sourcePart(filteringSampleDefinition, 'c#')
const messagingXaml = sourcePart(messagingSampleDefinition, 'xaml')
const messagingCSharp = sourcePart(messagingSampleDefinition, 'c#')
const imagesXaml = sourcePart(imagesSampleDefinition, 'xaml')
const imagesCSharp = sourcePart(imagesSampleDefinition, 'c#')
const contextXaml = sourcePart(contextSampleDefinition, 'xaml')
const contextCSharp = sourcePart(contextSampleDefinition, 'c#')
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
.gallery-page-content :deep(.listview-selection-example .listview-contact-template),
.gallery-page-content :deep(.listview-grouped-example .listview-contact-template),
.gallery-page-content :deep(.listview-filtering-example .listview-contact-template),
.gallery-page-content :deep(.listview-context-example .listview-contact-template),
.listview-drag-source :deep(.listview-contact-template),
.listview-drag-target :deep(.listview-contact-template) {
  width: 100%;
  min-width: 0;
  min-height: 52px;
  box-sizing: border-box;
}

.gallery-page-content :deep(.listview-selection-example .listview-contact-avatar),
.gallery-page-content :deep(.listview-grouped-example .listview-contact-avatar),
.gallery-page-content :deep(.listview-filtering-example .listview-contact-avatar),
.gallery-page-content :deep(.listview-context-example .listview-contact-avatar),
.listview-drag-source :deep(.listview-contact-avatar),
.listview-drag-target :deep(.listview-contact-avatar) {
  align-self: center;
  justify-self: center;
  flex: 0 0 auto;
}

.gallery-page-content :deep(.listview-selection-example .listview-contact-template > .win-text-block),
.gallery-page-content :deep(.listview-grouped-example .listview-contact-template > .win-text-block),
.gallery-page-content :deep(.listview-filtering-example .listview-contact-template > .win-text-block),
.gallery-page-content :deep(.listview-context-example .listview-contact-template > .win-text-block),
.listview-drag-source :deep(.listview-contact-template > .win-text-block),
.listview-drag-target :deep(.listview-contact-template > .win-text-block) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Keep the filtering and context-menu examples inside their display column;
   their operation panes must never become part of the list's measured width. */
.gallery-page-content :deep(.listview-filtering-example .example-display),
.gallery-page-content :deep(.listview-context-example .example-display) {
  min-width: 0;
}

.gallery-page-content :deep(.listview-filtering-example .listview-filtering-control),
.gallery-page-content :deep(.listview-context-example .listview-context-control) {
  flex: 0 0 400px;
  max-width: 100%;
  min-width: 0;
}

.gallery-page-content :deep(.listview-filtering-example .example-options) {
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
.gallery-page-content :deep(.listview-images-example .listview-images-control) {
  width: 550px;
  max-width: 100%;
  min-width: min(550px, 100%) !important;
}

.gallery-page-content :deep(.listview-images-example .win-list-content) {
  overflow-x: hidden;
}

.gallery-page-content :deep(.listview-images-example .listview-image-item) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  grid-template-columns: 150px minmax(0, 1fr) !important;
}

.gallery-page-content :deep(.listview-images-example .listview-image) {
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

.gallery-page-content :deep(.listview-images-example .listview-image .win-image-surface) {
  display: block;
  width: 150px !important;
  height: 100px !important;
  max-width: 150px !important;
  max-height: 100px !important;
  object-fit: fill;
}

.gallery-page-content :deep(.listview-images-example .win-list-item-content) {
  overflow: hidden;
}

.gallery-page-content :deep(.listview-images-example .listview-image-item > .win-stack-panel) {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.gallery-page-content :deep(.listview-images-example .listview-image-description) {
  width: 350px;
  max-width: 100%;
  max-height: 60px;
  overflow: hidden;
  box-sizing: border-box;
}

.gallery-page-content :deep(.listview-images-example .listview-image-stats) {
  min-width: 0;
  align-items: baseline;
}

.gallery-page-content :deep(.listview-images-example .listview-image-caption) {
  color: var(--TextFillColorSecondaryBrush, var(--text-secondary));
  font-size: 12px;
  line-height: 16px;
  white-space: pre !important;
}

/* Prevent long sample notes from participating in the adjacent options or
   output column's intrinsic width. */
.gallery-page-content :deep(.control-example-root),
.gallery-page-content :deep(.example-container),
.gallery-page-content :deep(.example-display) {
  min-width: 0;
}

.gallery-page-content :deep(.win-list-view) {
  max-width: 100%;
}

@media (max-width: 739px) {
  .gallery-page-content :deep(.listview-drag-grid) {
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: auto auto auto !important;
    row-gap: 12px;
  }

  .gallery-page-content :deep(.listview-drag-source),
  .gallery-page-content :deep(.listview-drag-target) {
    min-width: 0 !important;
    margin: 0 !important;
  }

  .gallery-page-content :deep(.listview-drag-source) {
    grid-area: 2 / 1 / span 1 / span 1 !important;
  }

  .gallery-page-content :deep(.listview-drag-target) {
    grid-area: 3 / 1 / span 1 / span 1 !important;
  }

  .gallery-page-content :deep(.listview-images-example .listview-images-control) {
    width: 100%;
    min-width: 0 !important;
  }

  .gallery-page-content :deep(.listview-images-example .listview-image-item) {
    grid-template-columns: 120px minmax(0, 1fr) !important;
  }

  .gallery-page-content :deep(.listview-images-example .listview-image),
  .gallery-page-content :deep(.listview-images-example .listview-image .win-image-surface) {
    width: 120px;
    max-width: 120px;
  }

  .gallery-page-content :deep(.listview-images-example .listview-image .win-image-surface) {
    width: 120px !important;
    height: 100px !important;
    max-width: 120px !important;
    max-height: 100px !important;
  }
}
</style>
