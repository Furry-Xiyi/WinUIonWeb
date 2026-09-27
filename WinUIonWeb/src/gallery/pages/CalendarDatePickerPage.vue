<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind themeLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}">
            <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" HeaderText="{x:Bind exampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind exampleXaml, Mode=OneWay}">
          <ControlExample.Example>
            <CalendarDatePicker Header="{x:Bind calendarHeader, Mode=OneWay}" PlaceholderText="{x:Bind placeholderText, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue'
import Button from '../../components/Button.vue'
import CalendarDatePicker from '../../components/CalendarDatePicker.vue'
import ControlExample from '../../components/ControlExample.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const pageTitle = t('text.calendardatepicker')
const pageDescription = t('text.the-calendardatepicker-is-a-drop-down-control-th')
const exampleHeader = t('text.calendardatepicker-with-a-header-and-placeholder')
const calendarHeader = t('text.calendar')
const placeholderText = t('text.pick-a-date')
const themeLabel = t('gallery.page-header.toggle-theme')
const favoriteLabel = t('gallery.page-header.favorite')
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'calendardatepicker')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const escapeXaml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const exampleXaml = `<CalendarDatePicker PlaceholderText="${escapeXaml(placeholderText)}" Header="${escapeXaml(calendarHeader)}" />`
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
