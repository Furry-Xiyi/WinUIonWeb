<template>
  <Page Ignorable="d">
    <ScrollViewer class="sample-page-scroll" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
      <Grid>
        <Grid.Resources>
          <x:Double x:Key="TileHeight">150</x:Double>
        </Grid.Resources>
        <Grid.ColumnDefinitions>
          <ColumnDefinition Width="Auto" />
          <ColumnDefinition Width="*" />
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
          <RowDefinition Height="Auto" />
          <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>
        <Grid x:Name="DestinationElement" Grid.Row="1" Grid.Column="0" Width="150" Height="200" MinHeight="{StaticResource TileHeight}" Margin="12" VerticalAlignment="Top" Background="PaleVioletRed" />
        <StackPanel x:Name="ContentPanel" Grid.Row="1" Grid.Column="1" MinHeight="200" Margin="12">
          <TextBlock Margin="0,0,0,12" Style="{ThemeResource TitleTextBlockStyle}" Text="{x:Bind titleText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <TextBlock Text="{x:Bind bodyText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        </StackPanel>
      </Grid>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Ellipse from '../../../components/Ellipse.vue'
import Grid from '../../../components/Grid.vue'
import Page from '../../../components/Page.vue'
import ScrollViewer from '../../../components/ScrollViewer.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import { useI18n } from '../../../components/i18n/index'
const { t } = useI18n()
const titleText = computed(() => t('sample.navigationview.lorem-title'))
const bodyText = computed(() => t('sample.navigationview.lorem-body'))
const shortBodyText = computed(() => t('sample.navigationview.lorem-short-body'))
const settingsPageText = computed(() => t('sample.navigationview.settings-page'))
</script>
<style scoped>
.sample-page-scroll { width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
.sample-content-grid { width: 100%; min-width: 0; max-width: 100%; height: 100%; }
</style>
