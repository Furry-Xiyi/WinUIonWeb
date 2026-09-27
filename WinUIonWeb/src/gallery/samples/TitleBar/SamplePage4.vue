<template>
<Page>

    <ScrollViewer>
        <StackPanel>
            <Grid>
                <Grid.Resources>
                    <x:Double x:Key="TileHeight">150</x:Double>
                </Grid.Resources>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="2*" />
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="*" />
                </Grid.ColumnDefinitions>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <Grid
                    Grid.Row="1"
                    Grid.RowSpan="2"
                    Grid.Column="0"
                    MinHeight="{StaticResource TileHeight}"
                    Margin="5"
                    Background="DarkSalmon" />
                <Grid
                    Grid.Row="1"
                    Grid.Column="1"
                    MinHeight="{StaticResource TileHeight}"
                    Margin="5"
                    Background="DarkRed" />
                <Grid
                    Grid.Row="1"
                    Grid.Column="2"
                    MinHeight="{StaticResource TileHeight}"
                    Margin="5"
                    Background="LightCoral" />

            </Grid>
            <Grid>
                <Grid.Resources>
                    <x:Double x:Key="TileHeight">150</x:Double>
                </Grid.Resources>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="2*" />
                </Grid.ColumnDefinitions>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="*" />
                </Grid.RowDefinitions>

                <Grid
                    Grid.Row="1"
                    Grid.Column="1"
                    MinHeight="{StaticResource TileHeight}"
                    Margin="5"
                    Background="DarkRed" />
                <Grid
                    Grid.Row="1"
                    Grid.Column="0"
                    MinHeight="{StaticResource TileHeight}"
                    Margin="5"
                    Background="LightCoral" />
                <Grid
                    Grid.Row="1"
                    Grid.Column="2"
                    MinHeight="{StaticResource TileHeight}"
                    Margin="5"
                    Background="IndianRed" />

                <Grid
                    Grid.Row="2"
                    Grid.ColumnSpan="3"
                    Margin="5">
                    <TextBlock Text="{x:Bind bodyText, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                </Grid>

            </Grid>
        </StackPanel>
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
