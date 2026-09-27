<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind PageTitle}" />
        <TextBlock class="page-description" Text="{x:Bind PageDescription}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" AutomationProperties.Name="{x:Bind ThemeActionText, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeActionText, Mode=OneWay}" Click="toggleTheme">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind FavoriteActionText, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteActionText, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite">
            <TextBlock class="icon" FontFamily="Segoe Fluent Icons" Text="{x:Bind FavoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </StackPanel>
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" VerticalAlignment="Top" ExampleHeight="Auto" SampleDefinition="RelativePanel\RelativepanelControl.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind RelativePanelCode}">
          <ControlExample.Example>
            <RelativePanel Width="300">
              <Rectangle x:Name="Rectangle1" Width="50" Height="50" Fill="Red" />
              <Rectangle x:Name="Rectangle2" Width="50" Height="50" Margin="8,0,0,0" Fill="Blue" RelativePanel.RightOf="Rectangle1" />
              <Rectangle x:Name="Rectangle3" Width="50" Height="50" Fill="Green" RelativePanel.AlignRightWithPanel="True" />
              <Rectangle x:Name="Rectangle4" Width="50" Height="50" Margin="0,8,0,0" Fill="Yellow" RelativePanel.AlignHorizontalCenterWith="Rectangle3" RelativePanel.Below="Rectangle3" />
            </RelativePanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Rectangle from '../../components/Rectangle.vue'
import RelativePanel from '../../components/RelativePanel.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'relativepanel')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const PageTitle = computed(() => t('text.relativepanel'))
const PageDescription = computed(() => t('text.relativepanel-description'))
const ThemeActionText = computed(() => t('gallery.page-header.toggle-theme'))
const FavoriteActionText = computed(() => t('gallery.page-header.favorite'))
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const RelativePanelCode = `<RelativePanel Width="300">
    <Rectangle x:Name="Rectangle1" Width="50" Height="50" Fill="Red" />
    <Rectangle x:Name="Rectangle2" Width="50" Height="50" Margin="8,0,0,0"
        Fill="Blue" RelativePanel.RightOf="Rectangle1" />
    <Rectangle x:Name="Rectangle3" Width="50" Height="50" Fill="Green"
        RelativePanel.AlignRightWithPanel="True" />
    <Rectangle x:Name="Rectangle4" Width="50" Height="50" Margin="0,8,0,0"
        Fill="Yellow" RelativePanel.AlignHorizontalCenterWith="Rectangle3"
        RelativePanel.Below="Rectangle3" />
</RelativePanel>`
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { color: var(--text-secondary); margin: 0 80px 16px 0; line-height: 20px; overflow-wrap: anywhere; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
