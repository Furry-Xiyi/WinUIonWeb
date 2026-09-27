<template>
  <Page>
    <ScrollViewer>
      <Grid>
        <Grid.Resources><x:Double x:Key="TileHeight">150</x:Double></Grid.Resources>
        <Grid.ColumnDefinitions>
          <ColumnDefinition Width="Auto" />
          <ColumnDefinition Width="*" />
          <ColumnDefinition Width="*" />
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
          <RowDefinition Height="Auto" />
          <RowDefinition Height="Auto" />
          <RowDefinition Height="Auto" />
          <RowDefinition Height="*" />
        </Grid.RowDefinitions>
        <Grid Grid.Row="1" Grid.Column="1" MinHeight="{StaticResource TileHeight}" Margin="6" Background="DarkGray" />
        <Grid Grid.Row="1" Grid.Column="2" MinHeight="{StaticResource TileHeight}" Margin="6" Background="LightGray" />
        <Grid Grid.Row="2" Grid.Column="1" MinHeight="{StaticResource TileHeight}" Margin="6" Background="LightGray" />
        <Grid Grid.Row="2" Grid.Column="2" MinHeight="{StaticResource TileHeight}" Margin="6" Background="DarkGray" />
        <Grid x:Name="SourceElement" Grid.Row="1" Grid.RowSpan="2" Grid.Column="0" MinWidth="250" MinHeight="{StaticResource TileHeight}" Margin="5" Background="{ThemeResource SystemAccentColor}" />
        <Grid Grid.Row="3" Grid.ColumnSpan="3" Margin="6,12">
          <TextBlock Style="{ThemeResource BodyTextBlockStyle}" Text="{x:Bind bodyText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        </Grid>
      </Grid>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Grid from '../../../components/Grid.vue'
import Page from '../../../components/Page.vue'
import ScrollViewer from '../../../components/ScrollViewer.vue'
import TextBlock from '../../../components/TextBlock.vue'
import { useI18n } from '../../../components/i18n/index'

const { t } = useI18n()
const bodyText = computed(() => t('sample.tabview.sample-body-long'))
</script>
