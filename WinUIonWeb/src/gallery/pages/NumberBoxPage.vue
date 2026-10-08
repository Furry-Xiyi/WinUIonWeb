<template>
  <Page>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
        <StackPanel>
          <ControlExample SampleDefinition="NumberBox\NumberboxEvaluatesExpressions.txt" HeaderText="{x:Bind Labels.Header0, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[0].Xaml}" CSharp="{x:Bind Sources[0].CSharp}">
            <ControlExample.Example>
              <NumberBox AcceptsExpression="True" Header="{x:Bind Labels.Text4, Mode=OneWay}" PlaceholderText="{x:Bind Labels.Text5, Mode=OneWay}" Value="NaN" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample SampleDefinition="NumberBox\NumberboxSpinButton.txt" HeaderText="{x:Bind Labels.Header1, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[1].Xaml}" CSharp="{x:Bind Sources[1].CSharp}">
            <ControlExample.Example>
              <NumberBox x:Name="NumberBoxSpinButtonPlacementExample" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind Labels.Text7, Mode=OneWay}" Header="{x:Bind Labels.Text8, Mode=OneWay}" LargeChange="100" SmallChange="10" SpinButtonPlacementMode="Compact" Value="10" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options>
              <RadioButtons x:Name="SpinButtonPlacementGroup" Header="{x:Bind Labels.Text9, Mode=OneWay}" SelectedIndex="0" SelectionChanged="SpinButtonPlacementGroup_SelectionChanged">
                <x:String x:Uid="text.inline">Inline</x:String>
                <x:String x:Uid="sample.numberbox.compact">Compact</x:String>
              </RadioButtons>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="SpinButtonPlacementMode" Value="{x:Bind SpinButtonPlacementMode, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>
          <ControlExample SampleDefinition="NumberBox\FormattedNumberboxRoundsNearest.txt" HeaderText="{x:Bind Labels.Header2, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[2].Xaml}" CSharp="{x:Bind Sources[2].CSharp}">
            <ControlExample.Example>
              <NumberBox x:Name="FormattedNumberBox" Header="{x:Bind Labels.Text13, Mode=OneWay}" PlaceholderText="{x:Bind Labels.Text14, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
        </StackPanel>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>

  </Page>
</template>

<script setup>
import { computed, inject, onMounted, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import ControlExample from '../../components/ControlExample.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import Grid from '../../components/Grid.vue';
import RowDefinition from '../../components/RowDefinition.vue';
import ColumnDefinition from '../../components/ColumnDefinition.vue';
import TextBlock from '../../components/TextBlock.vue';
import TextBox from '../../components/TextBox.vue';
import AutoSuggestBox from '../../components/AutoSuggestBox.vue';
import NumberBox from '../../components/NumberBox.vue';
import PasswordBox from '../../components/PasswordBox.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import RelativePanel from '../../components/RelativePanel.vue';
import Image from '../../components/Image.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import RadioButton from '../../components/RadioButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
import CheckBox from '../../components/CheckBox.vue';
import ComboBox from '../../components/ComboBox.vue';
import DropDownButton from '../../components/DropDownButton.vue';
import Flyout from '../../components/Flyout.vue';
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue';
import Rectangle from '../../components/Rectangle.vue';
import SymbolIcon from '../../components/SymbolIcon.vue';
import RichTextBlockOverflow from '../../components/RichTextBlockOverflow.vue';
import SampleCodePresenter from '../../components/SampleCodePresenter.vue';
import { Run, Span, Bold, Italic, Underline, LineBreak, Hyperlink, Paragraph } from '../../components/TextInline';
import { ComboBoxItem, XamlString } from '../../components/inlineControlProperties';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties';
import { ResourceDictionary } from '../../components/xamlPrimitives';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import Sample0 from '../samples/NumberBox/NumberboxEvaluatesExpressions.txt?raw';
import Sample1 from '../samples/NumberBox/NumberboxSpinButton.txt?raw';
import Sample2 from '../samples/NumberBox/FormattedNumberboxRoundsNearest.txt?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'numberbox');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ Title: t('text.numberbox'), Description: t('text.the-numberbox-control-allows-users-to-enter-numb'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header0: t('text.a-numberbox-that-evaluates-expressions'), Text4: t('text.enter-an-expression'), Text5: t('TextControls.NumberBox.Label1'), Header1: t('sample.numberbox.spin-button'), Text7: t('TextControls.NumberBox.Label2'), Text8: t('sample.numberbox.enter-integer'), Text9: t('sample.numberbox.spinbutton-placement'), Text10: t('text.inline'), Text11: t('sample.numberbox.compact'), Header2: t('sample.numberbox.formatted-rounding'), Text13: t('sample.numberbox.enter-dollar-amount'), Text14: t('TextControls.NumberBox.Label3') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const Sources = [Sample0,Sample1,Sample2].map(sample => ({ Xaml: sample.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\r?\n/m)[1]?.trim() ?? '' }));
const formatter = { FormatDouble: value => (Math.floor(value * 4 + 0.5) / 4).toFixed(2), ParseDouble: value => Number(value) };
const SpinButtonPlacementMode = ref('Inline');
const SetNumberBoxNumberFormatter = () => { if (controls.FormattedNumberBox) controls.FormattedNumberBox.NumberFormatter = formatter; };
const SpinButtonPlacementGroup_SelectionChanged = sender => {
  SpinButtonPlacementMode.value = sender.SelectedIndex === 0 ? 'Inline' : 'Compact';
  if (controls.NumberBoxSpinButtonPlacementExample) controls.NumberBoxSpinButtonPlacementExample.SpinButtonPlacementMode = SpinButtonPlacementMode.value;
};

provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, toggleTheme, toggleFavorite, SpinButtonPlacementMode, SetNumberBoxNumberFormatter, SpinButtonPlacementGroup_SelectionChanged });
onMounted(() => {
  SetNumberBoxNumberFormatter();
  if (controls.SpinButtonPlacementGroup) SpinButtonPlacementGroup_SelectionChanged(controls.SpinButtonPlacementGroup);
});
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
</style>
