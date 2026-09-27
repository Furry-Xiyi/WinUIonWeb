<template>
  <ScrollViewer class="gallery-page-scroll date-time-picker-gallery-page" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
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
        <ControlExample x:Name="Example1" HeaderText="{x:Bind example1Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind example1Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <DatePicker Header="{x:Bind pickerHeader, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example2" HeaderText="{x:Bind example2Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind example2Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel Orientation="Horizontal">
              <DatePicker
                x:Name="Control2"
                Date="{x:Bind control2Date, Mode=OneWay}"
                DayFormat="{}{day.integer} ({dayofweek.abbreviated})"
                YearVisible="False"
                MinYear="{x:Bind control2MinYear, Mode=OneWay}"
                MaxYear="{x:Bind control2MaxYear, Mode=OneWay}" />
              <TextBlock x:Name="Control2Output" Style="{StaticResource BodyTextBlockStyle}" />
            </StackPanel>
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
import ControlExample from '../../components/ControlExample.vue'
import DatePicker from '../../components/DatePicker.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const pageTitle = t('text.datepicker')
const pageDescription = t('text.use-a-datepicker-to-let-users-set-a-date-in-your')
const example1Header = t('text.a-simple-datepicker-with-a-header')
const example2Header = t('sample.datepicker.day-formatted-year-hidden')
const pickerHeader = t('text.pick-a-date')
const themeLabel = t('gallery.page-header.toggle-theme')
const favoriteLabel = t('gallery.page-header.favorite')
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'datepicker')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const now = new Date()
const addMonths = (source, months) => {
  const result = new Date(source)
  const day = result.getDate()
  result.setDate(1)
  result.setMonth(result.getMonth() + months)
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()
  result.setDate(Math.min(day, lastDay))
  return result
}
const addYears = (source, years) => {
  const result = new Date(source)
  const day = result.getDate()
  result.setDate(1)
  result.setFullYear(result.getFullYear() + years)
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()
  result.setDate(Math.min(day, lastDay))
  return result
}
const control2Date = addMonths(now, 2)
const control2MinYear = new Date(now)
const control2MaxYear = addYears(now, 5)

const escapeXaml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const example1Xaml = `<DatePicker Header="${escapeXaml(pickerHeader)}" />`
const example2Xaml = `<DatePicker DayFormat="{}{day.integer} ({dayofweek.abbreviated})" YearVisible="False" />`
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
