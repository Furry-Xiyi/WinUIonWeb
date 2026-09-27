<template>
<Page>

    <ScrollViewer>
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

            <Grid
                x:Name="DestinationElement"
                Grid.Row="1"
                Grid.Column="0"
                Width="150"
                Height="200"
                MinHeight="{StaticResource TileHeight}"
                Margin="12"
                VerticalAlignment="Top"
                Background="{ThemeResource SystemAccentColor}" />

            <StackPanel
                x:Name="ContentPanel"
                Grid.Row="1"
                Grid.Column="1"
                MinHeight="200"
                Margin="12">
                <TextBlock
                    Margin="0,0,0,12"
                    Style="{ThemeResource TitleTextBlockStyle}"
                    Text="{x:Bind titleText, Mode=OneWay}"
                    TextWrapping="WrapWholeWords" />
                <TextBlock Text="{x:Bind bodyText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
            </StackPanel>

        </Grid>
    </ScrollViewer>
</Page>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import ColumnDefinition from '../../../components/ColumnDefinition.vue'
import Grid from '../../../components/Grid.vue'
import Page from '../../../components/Page.vue'
import RowDefinition from '../../../components/RowDefinition.vue'
import ScrollViewer from '../../../components/ScrollViewer.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import { useI18n } from '../../../components/i18n/index'
import { xamlScopeKey } from '../../../components/xamlRuntime'
const { t } = useI18n()
const titleText = computed(() => t('sample.tabview.sample-title'))
const bodyText = computed(() => t('sample.tabview.sample-body-long'))
provide(xamlScopeKey, { titleText, bodyText })
</script>
