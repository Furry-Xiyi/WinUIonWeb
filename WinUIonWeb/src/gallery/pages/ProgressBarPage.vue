<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
        <TextBlock class="page-header" FontSize="28" FontWeight="SemiBold" Text="{x:Bind Labels.Title, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" FontSize="16" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" class="basic-input-example-theme" SampleDefinition="ProgressBar\IndeterminateProgressBar.txt" HeaderText="{x:Bind Labels.Indeterminate, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind IndeterminateXaml, Mode=OneWay}">
            <ControlExample.Example>
              <ProgressBar
                Width="130"
                Margin="10,10,0,0"
                VerticalAlignment="Top"
                IsIndeterminate="True"
                ShowError="{x:Bind ErrorRB.IsChecked.Value, Mode=OneWay}"
                ShowPaused="{x:Bind PausedRB.IsChecked.Value, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <RadioButtons Header="{x:Bind Labels.ProgressState, Mode=OneWay}">
                <RadioButton x:Name="RunningRB" Content="{x:Bind Labels.Running, Mode=OneWay}" IsChecked="True" />
                <RadioButton x:Name="PausedRB" Content="{x:Bind Labels.Paused, Mode=OneWay}" />
                <RadioButton x:Name="ErrorRB" Content="{x:Bind Labels.Error, Mode=OneWay}" />
              </RadioButtons>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="ShowPaused" Value="{x:Bind PausedRB.IsChecked.Value, Mode=OneWay}" />
              <ControlExampleSubstitution Key="ShowError" Value="{x:Bind ErrorRB.IsChecked.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>

          <ControlExample class="basic-input-example-theme" SampleDefinition="ProgressBar\DeterminateProgressBar.txt" HeaderText="{x:Bind Labels.Determinate, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind DeterminateXaml, Mode=OneWay}">
            <ControlExample.Example>
              <ScrollViewer HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto" VerticalScrollMode="Disabled" VerticalScrollBarVisibility="Disabled">
              <StackPanel x:Name="Control2" class="determinate-example" Orientation="Horizontal">
                <ProgressBar x:Name="ProgressBar2" Width="130" AutomationProperties.Name="{x:Bind Labels.DeterminateName, Mode=OneWay}" />
                <TextBlock x:Name="Control2Output" Width="60" Style="{ThemeResource OutputTextBlockStyle}" TextAlignment="Center" />
                <TextBlock x:Name="ProgressLabel" Margin="0,0,10,0" VerticalAlignment="Center" Text="{x:Bind Labels.Progress, Mode=OneWay}" />
                <NumberBox
                  x:Name="ProgressValue"
                  AutomationProperties.LabeledBy="{Binding ElementName=ProgressLabel}"
                  AutomationProperties.Name="{x:Bind Labels.NumberBoxName, Mode=OneWay}"
                  Maximum="100"
                  Minimum="0"
                  SpinButtonPlacementMode="Inline"
                  ValueChanged="ProgressValue_ValueChanged"
                  Value="0" />
              </StackPanel>
              </ScrollViewer>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="DeterminateProgressValue" Value="{x:Bind ProgressBar2.Value, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import FontIcon from '../../components/FontIcon.vue';
import NumberBox from '../../components/NumberBox.vue';
import Page from '../../components/Page.vue';
import ProgressBar from '../../components/ProgressBar.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import indeterminateSample from '../samples/ProgressBar/IndeterminateProgressBar.txt?raw';
import determinateSample from '../samples/ProgressBar/DeterminateProgressBar.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'progressbar');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);

const Labels = computed(() => ({
  Title: t('text.progressbar'), Description: t('text.progressbar-description'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  Indeterminate: t('sample.progressbar.indeterminate'), Determinate: t('sample.progressbar.determinate'),
  ProgressState: t('sample.progressbar.progress-state'), Running: t('sample.progressbar.running'),
  Paused: t('sample.progressbar.paused'), Error: t('sample.progressbar.error'), Progress: t('sample.progressbar.progress'),
  DeterminateName: t('sample.progressbar.determinate-name'), NumberBoxName: t('sample.progressbar.numberbox-name')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const IndeterminateXaml = indeterminateSample.split('--- xaml')[1].trim();
const DeterminateXaml = determinateSample.split('--- xaml')[1].trim();

const ProgressValue_ValueChanged = (sender) => {
  if (!Number.isNaN(sender.Value)) {
    controls.ProgressBar2.Value = sender.Value;
  } else {
    sender.Value = 0;
  }
};

provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  IndeterminateXaml, DeterminateXaml, ProgressValue_ValueChanged
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { color: var(--text-secondary); margin: 0 0 16px; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; }
.determinate-example { min-width: 0; }
</style>
