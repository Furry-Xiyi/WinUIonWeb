<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind toggleThemeLabel, Mode=OneWay}"><FontIcon Glyph="&#xE793;" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" Height="750" HorizontalContentAlignment="Stretch" SampleDefinition="ParallaxView\ParallaxViewParallaxListview.txt" HeaderText="{x:Bind listViewHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind listViewCode}">
            <ControlExample.Example>
              <Grid>
                <ParallaxView x:Name="parallaxView" Source="{Binding ElementName=listView}" VerticalShift="500" HorizontalAlignment="Left" VerticalAlignment="Top">
                    <Image Source="{x:Bind cliffImage, Mode=OneWay}" />
                </ParallaxView>
                <ListView x:Name="listView" HorizontalAlignment="Stretch" VerticalAlignment="Top" Background="#80000000" HighContrastAdjustment="Auto" AutomationProperties.Name="{x:Bind allSamplesLabel, Mode=OneWay}" ItemsSource="{x:Bind Items, Mode=OneWay}">
                  <ListView.ItemTemplate>
                    <DataTemplate x:DataType="models:ControlInfoDataItem">
                      <TextBlock Text="{x:Bind Title}" Foreground="{ThemeResource SystemControlForegroundAltHighBrush}" />
                    </DataTemplate>
                  </ListView.ItemTemplate>
                  <ListView.Header>
                    <TextBlock MaxWidth="280" HorizontalAlignment="Center" VerticalAlignment="Center" FontSize="28" Foreground="White" Text="{x:Bind listHeading, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                  </ListView.Header>
                </ListView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example2" Height="750" HorizontalContentAlignment="Stretch" SampleDefinition="ParallaxView\ParallaxViewParallaxScrollview.txt" HeaderText="{x:Bind scrollViewHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind scrollViewCode}">
            <ControlExample.Example>
              <Grid>
                <ParallaxView Source="{Binding ElementName=scrollView}" VerticalShift="500" HorizontalAlignment="Left" VerticalAlignment="Top">
                  <Image Source="{x:Bind cliffImage, Mode=OneWay}" />
                </ParallaxView>
                <TextBlock MaxWidth="280" HorizontalAlignment="Center" VerticalAlignment="Top" FontSize="28" Foreground="White" Text="{x:Bind rectanglesHeading, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <ScrollView x:Name="scrollView" Width="150" HorizontalAlignment="Left">
                  <StackPanel>
                    <Rectangle Height="150" Fill="AliceBlue" />
                    <Rectangle Height="150" Fill="AntiqueWhite" />
                    <Rectangle Height="150" Fill="Aqua" />
                    <Rectangle Height="150" Fill="Aquamarine" />
                    <Rectangle Height="150" Fill="Azure" />
                    <Rectangle Height="150" Fill="Beige" />
                    <Rectangle Height="150" Fill="Bisque" />
                    <Rectangle Height="150" Fill="BlanchedAlmond" />
                    <Rectangle Height="150" Fill="BlueViolet" />
                    <Rectangle Height="150" Fill="Brown" />
                    <Rectangle Height="150" Fill="BurlyWood" />
                    <Rectangle Height="150" Fill="CadetBlue" />
                    <Rectangle Height="150" Fill="Chartreuse" />
                    <Rectangle Height="150" Fill="Chocolate" />
                    <Rectangle Height="150" Fill="Coral" />
                    <Rectangle Height="150" Fill="CornflowerBlue" />
                    <Rectangle Height="150" Fill="Cornsilk" />
                    <Rectangle Height="150" Fill="Crimson" />
                    <Rectangle Height="150" Fill="Cyan" />
                  </StackPanel>
                </ScrollView>
              </Grid>
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
import { computed, inject } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import { DataTemplate } from '../../components/CollectionProperties';
import Grid from '../../components/Grid.vue';
import Image from '../../components/Image.vue';
import ListView from '../../components/ListView.vue';
import ParallaxView from '../../components/ParallaxView.vue';
import Page from '../../components/Page.vue';
import Rectangle from '../../components/Rectangle.vue';
import ScrollView from '../../components/ScrollView.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';
import controlInfoGroups from '../samples/SemanticZoom/ControlInfoGroups.json';
import listViewDefinition from '../samples/ParallaxView/ParallaxViewParallaxListview.txt?raw';
import scrollViewDefinition from '../samples/ParallaxView/ParallaxViewParallaxScrollview.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'parallaxview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const pageTitle = computed(() => t('text.parallaxview'));
const pageDescription = computed(() => t('text.parallaxview-description'));
const listViewHeader = computed(() => t('sample.parallaxview.listview'));
const scrollViewHeader = computed(() => t('sample.parallaxview.scrollview'));
const listHeading = computed(() => t('sample.parallaxview.list-heading'));
const rectanglesHeading = computed(() => t('sample.parallaxview.rectangles-heading'));
const allSamplesLabel = computed(() => t('sample.parallaxview.all-samples'));
const toggleThemeLabel = computed(() => t('gallery.page-header.toggle-theme'));
const favoriteLabel = computed(() => t('gallery.page-header.favorite'));
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');

const cliffImage = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg';

// Official sample binds the ListView to every control in the gallery, ordered by title.
const Items = computed(() => controlInfoGroups.flatMap(group => group.Items)
  .map(item => ({ ...item, Title: t(item.TitleKey) }))
  .sort((a, b) => a.Title.localeCompare(b.Title)));

const sampleXaml = definition => definition.split(/--- xaml\s*\r?\n/)[1]?.trim() ?? '';
const listViewCode = sampleXaml(listViewDefinition);
const scrollViewCode = sampleXaml(scrollViewDefinition);
</script>
