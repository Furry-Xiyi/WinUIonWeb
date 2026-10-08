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
          <ControlExample x:Name="Example1" SampleDefinition="AutoSuggestBox\BasicAutosuggestBox.txt" HeaderText="{x:Bind Labels.Header0, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[0].Xaml}" CSharp="{x:Bind Sources[0].CSharp}">
            <ControlExample.Example>
              <StackPanel class="basic-suggestion-example" Orientation="Horizontal">
                <AutoSuggestBox x:Name="Control1" Width="300" AutomationProperties.Name="{x:Bind Labels.Text4, Mode=OneWay}" SuggestionChosen="AutoSuggestBox_SuggestionChosen" TextChanged="AutoSuggestBox_TextChanged" />
                <TextBlock x:Name="SuggestionOutput" FontFamily="Global User Interface" Style="{StaticResource OutputTextBlockStyle}" Text="{x:Bind suggestionOutput, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example2" SampleDefinition="AutoSuggestBox\AutosuggestboxProvidesSearchboxExperience.txt" HeaderText="{x:Bind Labels.Header1, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[1].Xaml}" CSharp="{x:Bind Sources[1].CSharp}">
            <ControlExample.Example>
              <Grid>
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <AutoSuggestBox x:Name="Control2" Width="300" HorizontalAlignment="Left" PlaceholderText="{x:Bind Labels.Text6, Mode=OneWay}" QueryIcon="Find" QuerySubmitted="Control2_QuerySubmitted" SuggestionChosen="Control2_SuggestionChosen" TextChanged="Control2_TextChanged" />
                <RelativePanel x:Name="ControlDetails" Grid.Row="1" Margin="0,8,0,0" HorizontalAlignment="Left" Visibility="{x:Bind DetailsVisibility, Mode=OneWay}">
                  <Image x:Name="ControlImage" Height="75" Source="{x:Bind ControlImageSource, Mode=OneWay}" />
                  <TextBlock x:Name="ControlTitle" Margin="8,0,0,0" RelativePanel.RightOf="ControlImage" Style="{StaticResource BaseTextBlockStyle}" Text="{x:Bind ControlTitleText, Mode=OneWay}" />
                  <TextBlock x:Name="ControlSubtitle" Margin="8,0,0,0" RelativePanel.AlignLeftWith="ControlTitle" RelativePanel.Below="ControlTitle" TextWrapping="WrapWholeWords" Text="{x:Bind ControlSubtitleText, Mode=OneWay}" />
                </RelativePanel>
              </Grid>
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
import officialControlData from '../samples/AutoSuggestBox/ControlInfoData.json';
import Sample0 from '../samples/AutoSuggestBox/BasicAutosuggestBox.txt?raw';
import Sample1 from '../samples/AutoSuggestBox/AutosuggestboxProvidesSearchboxExperience.txt?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'autosuggestbox');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ Title: t('text.autosuggestbox'), Description: t('text.use-an-autosuggestbox-to-provide-a-list-of-sugge'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header0: t('text.a-basic-autosuggestbox'), Text4: t('TextControls.AutoSuggestBox.Label1'), Header1: t('sample.autosuggestbox.search-experience'), Text6: t('sample.autosuggestbox.type-control-name') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const Sources = [Sample0,Sample1].map(sample => ({ Xaml: sample.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\r?\n/m)[1]?.trim() ?? '' }));
const cats = computed(() => t('TextControls.CatBreeds').split('|'));
const selectedControl = ref(null);
const suggestionOutput = ref('');
const controlData = computed(() => officialControlData.Groups.flatMap(group => group.Items).filter(item => item.IncludedInBuild !== false).map(item => ({ ...item, Title: item.Title, Subtitle: t('TextControls.Control.' + item.UniqueId), ImagePath: item.ImagePath ? 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/' + item.ImagePath.replace('ms-appx:///', '') : '' })));
const SearchControls = query => { const tokens = query.toLowerCase().split(' '); return controlData.value.filter(item => tokens.every(token => item.Title.toLowerCase().includes(token))).sort((a,b) => Number(b.Title.toLowerCase().startsWith(query.toLowerCase())) - Number(a.Title.toLowerCase().startsWith(query.toLowerCase())) || a.Title.localeCompare(b.Title)); };
const AutoSuggestBox_TextChanged = (sender,args) => { if (args.Reason !== 'UserInput') return; const tokens = sender.Text.toLowerCase().split(' '); const found = cats.value.filter(cat => tokens.every(token => cat.toLowerCase().includes(token))); sender.ItemsSource = found.length ? found : [t('text.no-results-found')]; };
const AutoSuggestBox_SuggestionChosen = (_sender,args) => { suggestionOutput.value = String(args.SelectedItem); };
const Control2_TextChanged = (sender,args) => { if(args.Reason !== 'UserInput') return; const found = SearchControls(sender.Text); sender.ItemsSource = found.length ? found : [t('text.no-results-found')]; };
const Control2_SuggestionChosen = (sender,args) => { if(args.SelectedItem && typeof args.SelectedItem === 'object') sender.Text = args.SelectedItem.Title; };
const Control2_QuerySubmitted = (sender,args) => {
  const chosen = typeof args.ChosenSuggestion === 'object' && args.ChosenSuggestion ? args.ChosenSuggestion : args.QueryText.trim() ? SearchControls(sender.Text)[0] : null;
  if (chosen) selectedControl.value = chosen;
};
const DetailsVisibility = computed(() => selectedControl.value ? 'Visible' : 'Collapsed');
const ControlTitleText = computed(() => selectedControl.value?.Title ?? '');
const ControlSubtitleText = computed(() => selectedControl.value?.Subtitle ?? '');
const ControlImageSource = computed(() => selectedControl.value?.ImagePath ?? '');

provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, toggleTheme, toggleFavorite,
  suggestionOutput, DetailsVisibility, ControlTitleText, ControlSubtitleText, ControlImageSource,
  AutoSuggestBox_TextChanged, AutoSuggestBox_SuggestionChosen, Control2_TextChanged, Control2_SuggestionChosen, Control2_QuerySubmitted
});
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
.basic-suggestion-example { flex-wrap: wrap; min-width: 0; }
.basic-suggestion-example :deep(.win-text-block) { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
</style>
