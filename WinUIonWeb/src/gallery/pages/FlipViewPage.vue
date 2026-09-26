<template>
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
        <ControlExample HeaderText="{x:Bind simpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind simpleXaml, Mode=OneWay}" ExampleHeight="Auto">
          <ControlExample.Example>
            <FlipView
              Height="270"
              MaxWidth="400"
              AutomationProperties.AutomationControlType="List"
              AutomationProperties.LocalizedControlType="list">
              <Image AutomationProperties.Name="Cliff" Source="{x:Bind cliffSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Grapes" Source="{x:Bind grapesSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Rainier" Source="{x:Bind rainierSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Sunset" Source="{x:Bind sunsetSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Valley" Source="{x:Bind valleySource, Mode=OneWay}" />
            </FlipView>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind boundDataHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind boundXaml, Mode=OneWay}">
          <ControlExample.Example>
            <FlipView
              Height="180"
              MaxWidth="400"
              AutomationProperties.AutomationControlType="List"
              AutomationProperties.LocalizedControlType="list"
              BorderBrush="Black"
              BorderThickness="1"
              ItemsSource="{x:Bind controlItems, Mode=OneWay}">
              <FlipView.ItemTemplate>
                <DataTemplate x:DataType="models:ControlInfoDataItem">
                  <Grid>
                    <Grid.RowDefinitions>
                      <RowDefinition Height="*" />
                      <RowDefinition Height="Auto" />
                    </Grid.RowDefinitions>
                    <Image
                      Width="36"
                      HorizontalAlignment="Center"
                      VerticalAlignment="Center"
                      Source="{x:Bind ImagePath}"
                      Stretch="Uniform" />
                    <Border Grid.Row="1" Height="60" Background="#A5FFFFFF">
                      <TextBlock
                        Text="{x:Bind Title}"
                        Foreground="Black"
                        Padding="12,12"
                        Style="{StaticResource TitleTextBlockStyle}"
                        HorizontalAlignment="Center" />
                    </Border>
                  </Grid>
                </DataTemplate>
              </FlipView.ItemTemplate>
            </FlipView>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind verticalHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind verticalXaml, Mode=OneWay}">
          <ControlExample.Example>
            <FlipView
              Height="270"
              MaxWidth="400"
              AutomationProperties.AutomationControlType="List"
              AutomationProperties.LocalizedControlType="list">
              <Image AutomationProperties.Name="Cliff" Source="{x:Bind cliffSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Grapes" Source="{x:Bind grapesSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Rainier" Source="{x:Bind rainierSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Sunset" Source="{x:Bind sunsetSource, Mode=OneWay}" />
              <Image AutomationProperties.Name="Valley" Source="{x:Bind valleySource, Mode=OneWay}" />
              <FlipView.ItemsPanel><ItemsPanelTemplate><VirtualizingStackPanel Orientation="Vertical" /></ItemsPanelTemplate></FlipView.ItemsPanel>
            </FlipView>
          </ControlExample.Example>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import FlipView from '../../components/FlipView.vue'
import Grid from '../../components/Grid.vue'
import Border from '../../components/Border.vue'
import Image from '../../components/Image.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'

const { t } = useI18n()
const pageTitle = t('text.flipview')
const pageDescription = t('text.the-flipview-lets-you-flip-through-a-collection')
const simpleHeader = t('sample.flipview.simple')
const boundDataHeader = t('sample.flipview.bound-data-template')
const verticalHeader = t('sample.flipview.vertical')
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'flipview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const media = (name) => 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/' + name
const cliffSource = media('cliff.jpg')
const grapesSource = media('grapes.jpg')
const rainierSource = media('rainier.jpg')
const sunsetSource = media('sunset.jpg')
const valleySource = media('valley.jpg')
const controlItems = [
  { Title: t('text.resources'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CodeTagIcon.png' },
  { Title: t('text.style'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CodeTagIcon.png' },
  { Title: t('text.binding'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CodeTagIcon.png' },
  { Title: t('text.templates'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CodeTagIcon.png' },
  { Title: t('text.custom-user-controls'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CustomControls.png' },
  { Title: t('text.xaml-conditions'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CodeTagIcon.png' },
  { Title: t('text.scratch-pad'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/ScratchPad.png' },
  { Title: t('text.color'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/ColorPaletteResources.png' },
  { Title: t('text.geometry'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Shape.png' },
  { Title: t('text.iconography'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/IconElement.png' },
  { Title: t('text.spacing'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/CompactSizing.png' },
  { Title: t('text.typography'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/TextBlock.png' },
  { Title: t('text.color-contrast'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Accessibility.png' },
  { Title: t('text.keyboard-navigation'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Accessibility.png' },
  { Title: t('text.screen-reader'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Accessibility.png' }
]
const simpleXaml = `<FlipView MaxWidth="400" Height="270"
          AutomationProperties.AutomationControlType="List"
          AutomationProperties.LocalizedControlType="list">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="Cliff" />
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" AutomationProperties.Name="Grapes" />
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" AutomationProperties.Name="Rainier" />
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" AutomationProperties.Name="Sunset" />
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" AutomationProperties.Name="Valley" />
</FlipView>`
const boundXaml = `<FlipView MaxWidth="400" Height="180" BorderBrush="Black" BorderThickness="1"
          AutomationProperties.AutomationControlType="List"
          AutomationProperties.LocalizedControlType="list"
          ItemsSource="{x:Bind Items, Mode=OneWay}">
    <FlipView.ItemTemplate>
        <DataTemplate x:DataType="models:ControlInfoDataItem">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="*" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <Image Width="36" Source="{x:Bind ImagePath}" Stretch="Uniform" HorizontalAlignment="Center" VerticalAlignment="Center" />
                <Border Grid.Row="1" Height="60" Background="#A5FFFFFF">
                    <TextBlock Text="{x:Bind Title}" Foreground="Black" Padding="12,12" Style="{StaticResource TitleTextBlockStyle}" HorizontalAlignment="Center" />
                </Border>
            </Grid>
        </DataTemplate>
    </FlipView.ItemTemplate>
</FlipView>`
const verticalXaml = `<FlipView MaxWidth="400" Height="270"
          AutomationProperties.AutomationControlType="List"
          AutomationProperties.LocalizedControlType="list">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="Cliff" />
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" AutomationProperties.Name="Grapes" />
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" AutomationProperties.Name="Rainier" />
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" AutomationProperties.Name="Sunset" />
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" AutomationProperties.Name="Valley" />
    <FlipView.ItemsPanel>
        <ItemsPanelTemplate>
            <VirtualizingStackPanel Orientation="Vertical" />
        </ItemsPanelTemplate>
    </FlipView.ItemsPanel>
</FlipView>`
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
