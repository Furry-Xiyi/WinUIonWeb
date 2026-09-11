<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.slider'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.use-a-slider-to-let-users-set-a-value-by-moving'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="Slider\SliderSimple.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind sliderSimpleVue, Mode=OneWay}" HeaderText="{x:Bind $t('text.a-simple-slider'), Mode=OneWay}">
              <StackPanel Orientation="Horizontal">
                <Slider Width="200" Value="{x:Bind slider1, Mode=TwoWay}" />
              </StackPanel>
              <ControlExample.Output>
                <TextBlock Text="{x:Bind String(slider1), Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="Slider\SliderRange.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind sliderRangeVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.slider.range'), Mode=OneWay}">
              <ControlExample.Options>
                <Grid>
                  <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition />
                    <RowDefinition />
                    <RowDefinition />
                    <RowDefinition />
                  </Grid.RowDefinitions>
                  <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="Auto" />
                    <ColumnDefinition Width="Auto" MinWidth="80" />
                  </Grid.ColumnDefinitions>
                  <TextBlock Grid.Row="0" Grid.Column="0" Text="{x:Bind $t('sample.slider.minimum'), Mode=OneWay}" />
                  <NumberBox Grid.Row="0" Grid.Column="1" Margin="10,-5,0,0" SpinButtonPlacementMode="Compact" Value="{x:Bind minimumValue, Mode=TwoWay}" />
                  <TextBlock Grid.Row="1" Grid.Column="0" Margin="0,7,0,0" Text="{x:Bind $t('sample.slider.maximum'), Mode=OneWay}" />
                  <NumberBox Grid.Row="1" Grid.Column="1" Margin="10,5,0,0" SpinButtonPlacementMode="Compact" Value="{x:Bind maximumValue, Mode=TwoWay}" />
                  <TextBlock Grid.Row="2" Grid.Column="0" Margin="0,5,0,0" Text="{x:Bind $t('sample.slider.step-frequency'), Mode=OneWay}" />
                  <NumberBox Grid.Row="2" Grid.Column="1" Margin="10,5,0,0" Minimum="{x:Bind 1, Mode=OneWay}" SpinButtonPlacementMode="Compact" Value="{x:Bind stepFrequencyValue, Mode=TwoWay}" />
                  <TextBlock Grid.Row="3" Grid.Column="0" Margin="0,5,0,0" Text="{x:Bind $t('sample.slider.small-change'), Mode=OneWay}" />
                  <NumberBox Grid.Row="3" Grid.Column="1" Margin="10,5,0,0" SpinButtonPlacementMode="Compact" Value="{x:Bind smallChangeValue, Mode=TwoWay}" />
                </Grid>
              </ControlExample.Options>
              <ControlExample.Example>
                <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                  <Slider
                    Width="200"
                    Margin="0,0,10,0"
                    Header="{x:Bind $t('sample.slider.control-header'), Mode=OneWay}"
                    Maximum="{x:Bind maximumValue, Mode=OneWay}"
                    Minimum="{x:Bind minimumValue, Mode=OneWay}"
                    SmallChange="{x:Bind smallChangeValue, Mode=OneWay}"
                    StepFrequency="{x:Bind stepFrequencyValue, Mode=OneWay}"
                    Value="{x:Bind slider2, Mode=TwoWay}" />
                </StackPanel>
              </ControlExample.Example>
              <ControlExample.Output>
                <TextBlock Text="{x:Bind String(slider2), Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="Slider\SliderTicks.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind sliderTicksVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.slider.ticks'), Mode=OneWay}">
              <StackPanel Orientation="Horizontal">
                <Slider Width="290" TickFrequency="20" TickPlacement="Outside" SnapsTo="{x:Bind snapsTo, Mode=OneWay}" Value="{x:Bind slider3, Mode=TwoWay}" />
              </StackPanel>
              <ControlExample.Output>
                <TextBlock Text="{x:Bind String(slider3), Mode=OneWay}" />
              </ControlExample.Output>
              <ControlExample.Options>
                <StackPanel>
                  <RadioButtons
                    Header="{x:Bind $t('sample.slider.snaps-to'), Mode=OneWay}"
                    SelectedIndex="{x:Bind snapsToIndex, Mode=TwoWay}"
                    SelectionChanged="SnapsToRadioButtons_SelectionChanged">
                    <x:String>StepValues</x:String>
                    <x:String>Ticks</x:String>
                  </RadioButtons>
                </StackPanel>
              </ControlExample.Options>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="Slider\SliderVertical.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind sliderVerticalVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.slider.vertical'), Mode=OneWay}">
              <StackPanel Orientation="Horizontal">
                <Slider Width="100" Height="100" Maximum="{x:Bind 50, Mode=OneWay}" Minimum="{x:Bind -50, Mode=OneWay}" Orientation="Vertical" TickFrequency="10" TickPlacement="Outside" Value="{x:Bind slider4, Mode=TwoWay}" />
              </StackPanel>
              <ControlExample.Output>
                <TextBlock Text="{x:Bind String(slider4), Mode=OneWay}" />
              </ControlExample.Output>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import NumberBox from '../../components/NumberBox.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import Slider from '../../components/Slider.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'slider');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const slider1 = ref(0);
const slider2 = ref(800);
const minimumValue = ref(500);
const maximumValue = ref(1000);
const stepFrequencyValue = ref(10);
const smallChangeValue = ref(10);
const slider3 = ref(0);
const snapsToIndex = ref(0);
const slider4 = ref(0);

const snapItems = computed(() => [t('sample.step-values'), t('sample.ticks')]);
const snapsTo = computed(() => snapsToIndex.value === 0 ? 'StepValues' : 'Ticks');
const SnapsToRadioButtons_SelectionChanged = (event) => {
  snapsToIndex.value = event?.SelectedIndex ?? event?.SelectedItemIndex ?? 0;
};

const sliderSimpleVue = `<Slider AutomationProperties.Name="simple slider" Width="200" />`;
const sliderRangeVue = `<Slider
  Width="200"
  Header="{x:Bind $t('sample.slider.control-header'), Mode=OneWay}"
  Maximum="{x:Bind maximumValue, Mode=OneWay}"
  Minimum="{x:Bind minimumValue, Mode=OneWay}"
  SmallChange="{x:Bind smallChangeValue, Mode=OneWay}"
  StepFrequency="{x:Bind stepFrequencyValue, Mode=OneWay}"
  Value="{x:Bind 800, Mode=OneWay}" />`;
const sliderTicksVue = `<Slider AutomationProperties.Name="Slider with ticks" Width="290" TickFrequency="20" TickPlacement="Outside" />`;
const sliderVerticalVue = `<Slider
  AutomationProperties.Name="vertical slider"
  Width="100"
  Height="100"
  Maximum="{x:Bind 50, Mode=OneWay}"
  Minimum="{x:Bind -50, Mode=OneWay}"
  Orientation="Vertical"
  TickFrequency="10"
  TickPlacement="Outside" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.slider-options { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.options-grid { display: grid; grid-template-columns: auto minmax(80px, auto); gap: 8px 10px; align-items: center; }
.options-grid :deep(.win-number-box) { width: 92px; }
</style>
