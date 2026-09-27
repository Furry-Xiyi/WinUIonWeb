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
        <ControlExample x:Name="ExampleAccessories" HeaderText="{x:Bind exampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind exampleXaml, Mode=OneWay}">
          <ControlExample.Example>
            <CalendarView
              x:Name="Control1"
              VerticalAlignment="Top"
              CalendarIdentifier="{x:Bind CalendarIdentifier, Mode=OneWay}"
              IsGroupLabelVisible="{x:Bind IsGroupLabelVisible, Mode=OneWay}"
              IsOutOfScopeEnabled="{x:Bind IsOutOfScopeEnabled, Mode=OneWay}"
              SelectionMode="{x:Bind SelectionMode, Mode=OneWay}"
              Language="{x:Bind Language, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel class="calendar-options" Margin="0,-5,0,0">
              <CheckBox x:Name="isGroupLabelVisible" Content="{x:Bind groupLabelVisibleLabel, Mode=OneWay}" IsChecked="{x:Bind IsGroupLabelVisible, Mode=TwoWay}" />
              <CheckBox x:Name="isOutOfScopeEnabled" Content="{x:Bind outOfScopeEnabledLabel, Mode=OneWay}" IsChecked="{x:Bind IsOutOfScopeEnabled, Mode=TwoWay}" />
              <ComboBox
                x:Name="selectionMode"
                Margin="0,10,0,0"
                Header="{x:Bind selectionModeLabel, Mode=OneWay}"
                ItemsSource="{x:Bind selectionModes, Mode=OneWay}"
                DisplayMemberPath="Name"
                SelectedValuePath="Value"
                SelectedValue="{x:Bind SelectionMode, Mode=TwoWay}"
                SelectionChanged="SelectionMode_SelectionChanged" />
              <ComboBox
                x:Name="calendarIdentifier"
                Width="220"
                Margin="0,10,0,0"
                Header="{x:Bind calendarIdentifierLabel, Mode=OneWay}"
                ItemsSource="{x:Bind calendarIdentifiers, Mode=OneWay}"
                DisplayMemberPath="Name"
                SelectedValuePath="Value"
                SelectedValue="{x:Bind CalendarIdentifier, Mode=TwoWay}" />
              <ComboBox
                x:Name="calendarLanguages"
                Width="220"
                Margin="0,10,0,0"
                Header="{x:Bind languageLabel, Mode=OneWay}"
                ItemsSource="{x:Bind Languages, Mode=OneWay}"
                SelectedIndex="0"
                SelectionChanged="calendarLanguages_SelectionChanged">
                <ComboBox.ItemTemplate>
                  <DataTemplate x:DataType="helper:Language">
                    <TextBlock Text="{x:Bind Name}" />
                  </DataTemplate>
                </ComboBox.ItemTemplate>
              </ComboBox>
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import CalendarView from '../../components/CalendarView.vue'
import CheckBox from '../../components/CheckBox.vue'
import ComboBox from '../../components/ComboBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { DataTemplate } from '../../components/CollectionProperties'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import { calendarIdentifierValues, calendarLanguageCodes } from '../samples/CalendarSamples'

const { t } = useI18n()
const pageTitle = t('text.calendarview')
const pageDescription = t('text.the-calendarview-gives-a-standardized-way-to-let')
const exampleHeader = t('text.a-basic-calendar-view')
const themeLabel = t('gallery.page-header.toggle-theme')
const favoriteLabel = t('gallery.page-header.favorite')
const groupLabelVisibleLabel = t('sample.calendarview.is-group-label-visible')
const outOfScopeEnabledLabel = t('sample.calendarview.is-out-of-scope-enabled')
const selectionModeLabel = t('sample.calendarview.selection-mode')
const calendarIdentifierLabel = t('sample.calendarview.calendar-identifier')
const languageLabel = t('sample.calendarview.language')
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'calendarview')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

const IsGroupLabelVisible = ref(true)
const IsOutOfScopeEnabled = ref(true)
const SelectionMode = ref('Single')
const CalendarIdentifier = ref('GregorianCalendar')
const Language = ref('en')
const selectionModes = ['None', 'Single', 'Multiple'].map((Value) => ({
  Name: t(`sample.calendarview.selection.${Value}`), Value
}))
const calendarIdentifiers = calendarIdentifierValues.map((Value) => ({
  Name: t(`sample.calendarview.calendar.${Value}`), Value
}))
const Languages = calendarLanguageCodes.map((Code) => ({
  Name: t(`sample.calendarview.language.${Code}`), Code
}))

const SelectionMode_SelectionChanged = (sender) => {
  const value = sender.SelectedValue
  if (selectionModes.some((item) => item.Value === value)) SelectionMode.value = value
}
const calendarLanguages_SelectionChanged = (sender) => {
  const language = sender.SelectedItem
  if (language && Languages.some((item) => item.Code === language.Code)) Language.value = language.Code
}

const exampleXaml = computed(() => `<CalendarView
    SelectionMode="${SelectionMode.value}"
    IsGroupLabelVisible="${IsGroupLabelVisible.value ? 'True' : 'False'}"
    IsOutOfScopeEnabled="${IsOutOfScopeEnabled.value ? 'True' : 'False'}"
    Language="${Language.value}"
    CalendarIdentifier="${CalendarIdentifier.value}" />`)
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
.calendar-options { width: 220px; max-width: 100%; }
</style>
