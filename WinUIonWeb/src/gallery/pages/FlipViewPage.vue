<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.flipview'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.the-flipview-lets-you-flip-through-a-collection'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('sample.flipview.simple'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind simpleXaml, Mode=OneWay}" ExampleHeight="270">
          <ControlExample.Example>
            <FlipView Height="270" MaxWidth="400">
              <Image AutomationProperties.Name="Cliff" Source="{x:Bind cliffSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Grapes" Source="{x:Bind grapesSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Rainier" Source="{x:Bind rainierSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Sunset" Source="{x:Bind sunsetSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Valley" Source="{x:Bind valleySource, Mode=OneWay}" Stretch="UniformToFill" />
            </FlipView>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.flipview.bound-data-template'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind boundXaml, Mode=OneWay}" ExampleHeight="180">
          <ControlExample.Example>
            <FlipView Height="180" MaxWidth="400" BorderBrush="Black" BorderThickness="1" ItemsSource="{x:Bind controlItems, Mode=OneWay}">
              <FlipView.ItemTemplate>
                <DataTemplate>
                  <Grid>
                    <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
                    <Image Width="36" VerticalAlignment="Center" Source="{x:Bind ImagePath}" Stretch="Uniform" />
                    <Border Grid.Row="1" Height="60" Background="#A5FFFFFF">
                      <TextBlock Padding="12,12" HorizontalAlignment="Center" Foreground="Black" Text="{x:Bind Title}" />
                    </Border>
                  </Grid>
                </DataTemplate>
              </FlipView.ItemTemplate>
            </FlipView>
          </ControlExample.Example>
        </ControlExample>

        <ControlExample HeaderText="{x:Bind $t('sample.flipview.vertical'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind verticalXaml, Mode=OneWay}" ExampleHeight="270">
          <ControlExample.Example>
            <FlipView Height="270" MaxWidth="400">
              <Image AutomationProperties.Name="Cliff" Source="{x:Bind cliffSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Grapes" Source="{x:Bind grapesSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Rainier" Source="{x:Bind rainierSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Sunset" Source="{x:Bind sunsetSource, Mode=OneWay}" Stretch="UniformToFill" />
              <Image AutomationProperties.Name="Valley" Source="{x:Bind valleySource, Mode=OneWay}" Stretch="UniformToFill" />
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
  { Title: t('text.button'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Button.png' },
  { Title: t('text.checkbox'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Checkbox.png' },
  { Title: t('text.combobox'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/ComboBox.png' },
  { Title: t('text.radiobuttons'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/RadioButton.png' },
  { Title: t('text.slider'), ImagePath: 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/ControlImages/Slider.png' }
]
const simpleXaml = '<FlipView Height="270" MaxWidth="400"><Image AutomationProperties.Name="Cliff" Source="ms-appx:///Assets/SampleMedia/cliff.jpg" /><Image AutomationProperties.Name="Grapes" Source="ms-appx:///Assets/SampleMedia/grapes.jpg" /><Image AutomationProperties.Name="Rainier" Source="ms-appx:///Assets/SampleMedia/rainier.jpg" /><Image AutomationProperties.Name="Sunset" Source="ms-appx:///Assets/SampleMedia/sunset.jpg" /><Image AutomationProperties.Name="Valley" Source="ms-appx:///Assets/SampleMedia/valley.jpg" /></FlipView>'
const boundXaml = '<FlipView Height="180" MaxWidth="400" BorderBrush="Black" BorderThickness="1" ItemsSource="{x:Bind Items, Mode=OneWay}"><FlipView.ItemTemplate><DataTemplate><Grid><Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="Auto" /></Grid.RowDefinitions><Image Width="36" VerticalAlignment="Center" Source="{x:Bind ImagePath}" Stretch="Uniform" /><Border Grid.Row="1" Height="60" Background="#A5FFFFFF"><TextBlock Padding="12,12" HorizontalAlignment="Center" Foreground="Black" Text="{x:Bind Title}" /></Border></Grid></DataTemplate></FlipView.ItemTemplate></FlipView>'
const verticalXaml = '<FlipView Height="270"><FlipView.ItemsPanel><ItemsPanelTemplate><VirtualizingStackPanel Orientation="Vertical" /></ItemsPanelTemplate></FlipView.ItemsPanel></FlipView>'
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
