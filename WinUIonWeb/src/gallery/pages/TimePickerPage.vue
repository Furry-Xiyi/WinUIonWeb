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
            <TimePicker />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example2" HeaderText="{x:Bind example2Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind example2Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <TimePicker Header="{x:Bind arrivalTimeHeader, Mode=OneWay}" MinuteIncrement="15" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>

        <ControlExample x:Name="Example3" HeaderText="{x:Bind example3Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind example3Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <TimePicker ClockIdentifier="24HourClock" Header="{x:Bind twentyFourHourHeader, Mode=OneWay}" SelectedTime="{x:Bind sys:DateTime.Now.TimeOfDay}" />
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
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import TimePicker from '../../components/TimePicker.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const pageTitle = t('text.timepicker')
const pageDescription = t('text.use-a-timepicker-to-let-users-set-a-time-in-your')
const example1Header = t('text.a-simple-timepicker')
const example2Header = t('sample.timepicker.header-minute-increment')
const example3Header = t('sample.timepicker.24-hour-clock')
const arrivalTimeHeader = t('sample.timepicker.arrival-time')
const twentyFourHourHeader = t('sample.timepicker.24-hour-clock-header')
const themeLabel = t('gallery.page-header.toggle-theme')
const favoriteLabel = t('gallery.page-header.favorite')
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'timepicker')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const escapeXaml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const example1Xaml = '<TimePicker/>'
const example2Xaml = `<TimePicker Header="${escapeXaml(arrivalTimeHeader)}" MinuteIncrement="15" />`
const example3Xaml = `<TimePicker
  xmlns:sys="using:System"
  ClockIdentifier="24HourClock"
  Header="${escapeXaml(twentyFourHourHeader)}"
  SelectedTime="{x:Bind sys:DateTime.Now.TimeOfDay}" />`
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
