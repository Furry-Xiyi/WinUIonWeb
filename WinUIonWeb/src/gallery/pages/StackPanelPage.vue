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
        <ControlExample x:Name="Example1" SampleDefinition="StackPanel\StackpanelControl.txt" HeaderText="{x:Bind exampleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind exampleXaml, Mode=OneWay}" CSharp="{x:Bind exampleCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <StackPanel x:Name="Control1" Orientation="{x:Bind Orientation, Mode=OneWay}" Spacing="{x:Bind SpacingSlider.Value, Mode=OneWay}" VerticalAlignment="Top">
              <StackPanel.Resources>
                <Style TargetType="Rectangle">
                  <Setter Property="Height" Value="40" />
                  <Setter Property="Width" Value="40" />
                </Style>
              </StackPanel.Resources>
              <Rectangle Fill="Red" />
              <Rectangle Fill="Blue" />
              <Rectangle Fill="Green" />
              <Rectangle Fill="Yellow" />
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options>
            <StackPanel Spacing="12">
              <RadioButtons x:Name="OrientationGroup" Header="{x:Bind orientationLabel, Mode=OneWay}" SelectionChanged="OrientationGroup_SelectionChanged">
                <RadioButton Content="{x:Bind horizontalLabel, Mode=OneWay}" Tag="Horizontal" />
                <RadioButton Content="{x:Bind verticalLabel, Mode=OneWay}" IsChecked="True" Tag="Vertical" />
              </RadioButtons>
              <Slider x:Name="SpacingSlider" Header="{x:Bind spacingLabel, Mode=OneWay}" Maximum="16" Minimum="0" SnapsTo="Ticks" StepFrequency="1" TickFrequency="1" Value="{x:Bind spacingValue, Mode=TwoWay}" />
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
import ControlExample from '../../components/ControlExample.vue'
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties'
import RadioButton from '../../components/RadioButton.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import Rectangle from '../../components/Rectangle.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import Slider from '../../components/Slider.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const pageTitle = computed(() => t('text.stackpanel'))
const pageDescription = computed(() => t('text.stackpanel-description'))
const exampleHeader = computed(() => t('sample.stackpanel.control'))
const themeLabel = computed(() => t('gallery.page-header.toggle-theme'))
const favoriteLabel = computed(() => t('gallery.page-header.favorite'))
const orientationLabel = computed(() => t('text.orientation'))
const horizontalLabel = computed(() => t('text.horizontal'))
const verticalLabel = computed(() => t('text.vertical'))
const spacingLabel = computed(() => t('text.spacing'))
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'stackpanel')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const Orientation = ref('Vertical')
const spacingValue = ref(8)
const OrientationGroup_SelectionChanged = (args) => {
  const orientation = args?.SelectedItem?.Tag
  if (orientation === 'Horizontal' || orientation === 'Vertical') Orientation.value = orientation
}
const exampleXaml = computed(() => `<StackPanel Orientation="${Orientation.value}" Spacing="${spacingValue.value}">
    <StackPanel.Resources>
        <Style TargetType="Rectangle">
            <Setter Property="Height" Value="40" />
            <Setter Property="Width" Value="40" />
        </Style>
    </StackPanel.Resources>
    <Rectangle Fill="Red" />
    <Rectangle Fill="Blue" />
    <Rectangle Fill="Green" />
    <Rectangle Fill="Yellow" />
</StackPanel>`)
const exampleCSharp = `private void OrientationGroup_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if ((sender as RadioButtons)?.SelectedItem is not RadioButton selectedItem ||
        Enum.TryParse<Orientation>(selectedItem.Tag?.ToString(), out var orientation) is false ||
        Control1 is null)
    {
        return;
    }

    Control1.Orientation = orientation;
}`
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 72px 8px 0; }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
