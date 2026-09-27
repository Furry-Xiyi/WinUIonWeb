<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind themeLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind themeLabel, Mode=OneWay}"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind favoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteLabel, Mode=OneWay}"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
        </StackPanel>
      </StackPanel>

      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" SampleDefinition="VariableSizedWrapGrid\VariablesizedwrapgridControl.txt" HeaderText="{x:Bind exampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind sampleXaml, Mode=OneWay}" CSharp="{x:Bind sampleCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <VariableSizedWrapGrid x:Name="Control1" Width="400" ItemHeight="44" ItemWidth="44" MaximumRowsOrColumns="3" Orientation="{x:Bind orientation, Mode=TwoWay}">
              <Rectangle Fill="Red" />
              <Rectangle Height="80" Fill="Blue" VariableSizedWrapGrid.RowSpan="2" />
              <Rectangle Width="80" Fill="Green" VariableSizedWrapGrid.ColumnSpan="2" />
              <Rectangle Width="80" Height="80" Fill="Yellow" VariableSizedWrapGrid.ColumnSpan="2" VariableSizedWrapGrid.RowSpan="2" />
            </VariableSizedWrapGrid>
          </ControlExample.Example>
          <ControlExample.Options>
            <RadioButtons Header="{x:Bind orientationLabel, Mode=OneWay}" SelectionChanged="OrientationGroup_SelectionChanged">
              <RadioButton Content="{x:Bind horizontalLabel, Mode=OneWay}" Tag="Horizontal" />
              <RadioButton Content="{x:Bind verticalLabel, Mode=OneWay}" IsChecked="True" Tag="Vertical" />
            </RadioButtons>
          </ControlExample.Options>
          <ControlExample.Output />
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import RadioButton from '../../components/RadioButton.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue'
import Rectangle from '../../components/Rectangle.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject<Ref<string>>('currentPage')
const pageKey = computed(() => currentPage?.value || 'variablesizedwrapgrid')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const pageTitle = computed(() => t('text.variablesizedwrapgrid'))
const pageDescription = computed(() => t('text.variablesizedwrapgrid-description'))
const exampleHeader = computed(() => t('sample.variablesizedwrapgrid.control'))
const orientationLabel = computed(() => t('text.orientation'))
const horizontalLabel = computed(() => t('text.horizontal'))
const verticalLabel = computed(() => t('text.vertical'))
const themeLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteLabel = computed(() => t('gallery.page-header.favorite'))
const orientation = ref('Vertical')

const OrientationGroup_SelectionChanged = (args: { SelectedItem?: { Tag?: string } }) => {
  const next = args?.SelectedItem?.Tag
  if (next === 'Horizontal' || next === 'Vertical') orientation.value = next
}

const sampleXaml = computed(() => `<VariableSizedWrapGrid Orientation="${orientation.value}" MaximumRowsOrColumns="3" ItemHeight="44" ItemWidth="44">
    <Rectangle Fill="Red"/>
    <Rectangle Fill="Blue" Height="80" VariableSizedWrapGrid.RowSpan="2"/>
    <Rectangle Fill="Green" Width="80" VariableSizedWrapGrid.ColumnSpan="2"/>
    <Rectangle Fill="Yellow" Height="80" Width="80" VariableSizedWrapGrid.RowSpan="2" VariableSizedWrapGrid.ColumnSpan="2"/>
</VariableSizedWrapGrid>`)
const sampleCSharp = computed(() => `private void OrientationGroup_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if ((sender as RadioButtons)?.SelectedItem is not RadioButton selectedItem ||
        Enum.TryParse<Orientation>(selectedItem.Tag?.ToString(), out var orientation) is false ||
        Control1 is null)
    {
        return;
    }

    Control1.Orientation = orientation;
}`)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
