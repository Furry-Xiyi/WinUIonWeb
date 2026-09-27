<template>
  <Page>
    <Page.Resources><x:Double x:Key="SwatchSize">32</x:Double></Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-item-page">
        <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions"><Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button><ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton></div>
        </div>
        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" class="split-example" SampleDefinition="SplitButton\SplitButtonColorPicker.txt" WebViewHeight="150" HeaderText="{x:Bind Labels.ColorHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ColorXaml}" CSharp="{x:Bind SplitCSharp}">
            <ControlExample.Example>
              <Grid x:Name="Control1" ColumnSpacing="24">
                <SplitButton x:Name="myColorButton" MinWidth="0" MinHeight="0" Padding="0" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind Labels.FontColor, Mode=OneWay}" Click="myColorButton_Click">
                  <Border x:Name="CurrentColor" Width="{StaticResource SwatchSize}" Height="{StaticResource SwatchSize}" Margin="0" Background="{x:Bind CurrentColorValue, Mode=OneWay}" CornerRadius="4,0,0,4" />
                  <SplitButton.Flyout>
                    <Flyout Placement="Bottom">
                      <GridView IsItemClickEnabled="True" ItemClick="GridView_ItemClick">
                        <GridView.ItemsPanel><ItemsPanelTemplate><ItemsWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal" /></ItemsPanelTemplate></GridView.ItemsPanel>
                        <GridView.Resources><Style TargetType="Rectangle"><Setter Property="Width" Value="{StaticResource SwatchSize}" /><Setter Property="Height" Value="{StaticResource SwatchSize}" /><Setter Property="RadiusX" Value="4" /><Setter Property="RadiusY" Value="4" /></Style></GridView.Resources>
                        <GridView.Items>
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Red, Mode=OneWay}" Fill="Red" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Orange, Mode=OneWay}" Fill="Orange" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Yellow, Mode=OneWay}" Fill="Yellow" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Green, Mode=OneWay}" Fill="Green" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Blue, Mode=OneWay}" Fill="Blue" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Indigo, Mode=OneWay}" Fill="Indigo" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Violet, Mode=OneWay}" Fill="Violet" />
                          <Rectangle AutomationProperties.Name="{x:Bind Labels.Gray, Mode=OneWay}" Fill="Gray" />
                        </GridView.Items>
                      </GridView>
                    </Flyout>
                  </SplitButton.Flyout>
                </SplitButton>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options><RichEditBox x:Name="myRichEditBox" class="sample-editor" Width="240" MinHeight="96" PlaceholderText="{x:Bind Labels.Placeholder, Mode=OneWay}" TextChanged="MyRichEditBox_TextChanged" /></ControlExample.Options>
          </ControlExample>
          <ControlExample class="split-example" SampleDefinition="SplitButton\SplitButtonText.txt" HeaderText="{x:Bind Labels.TextHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind TextXaml}" CSharp="{x:Bind SplitCSharp}">
            <ControlExample.Example>
              <SplitButton x:Name="myColorButtonReveal" MinWidth="0" MinHeight="0" Padding="5" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind Labels.FontColorWithText, Mode=OneWay}" Content="{x:Bind Labels.ChooseColor, Mode=OneWay}">
                <SplitButton.Flyout><Flyout Placement="Bottom">
                  <VariableSizedWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal">
                    <VariableSizedWrapGrid.Resources>
                      <Style TargetType="Rectangle"><Setter Property="Width" Value="{StaticResource SwatchSize}" /><Setter Property="Height" Value="{StaticResource SwatchSize}" /><Setter Property="RadiusX" Value="4" /><Setter Property="RadiusY" Value="4" /></Style>
                      <Style TargetType="Button"><Setter Property="Padding" Value="0" /><Setter Property="MinWidth" Value="0" /><Setter Property="MinHeight" Value="0" /><Setter Property="Margin" Value="6" /><Setter Property="CornerRadius" Value="{StaticResource ControlCornerRadius}" /></Style>
                    </VariableSizedWrapGrid.Resources>
                    <Button AutomationProperties.Name="{x:Bind Labels.Red, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Red" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Orange, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Orange" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Yellow, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Yellow" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Green, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Green" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Blue, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Blue" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Indigo, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Indigo" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Violet, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Violet" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Gray, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Gray" /></Button.Content></Button>
                    <Button AutomationProperties.Name="{x:Bind Labels.Black, Mode=OneWay}" Click="RevealColorButton_Click"><Button.Content><Rectangle Fill="Black" /></Button.Content></Button>
                  </VariableSizedWrapGrid>
                </Flyout></SplitButton.Flyout>
              </SplitButton>
            </ControlExample.Example>
            <ControlExample.Output /><ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </div>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, provide, ref, shallowReactive } from 'vue';
import Border from '../../components/Border.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Flyout from '../../components/Flyout.vue';
import FontIcon from '../../components/FontIcon.vue';
import Grid from '../../components/Grid.vue';
import GridView from '../../components/GridView.vue';
import Page from '../../components/Page.vue';
import Rectangle from '../../components/Rectangle.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import SplitButton from '../../components/SplitButton.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import colorDefinition from '../samples/SplitButton/SplitButtonColorPicker.txt?raw';
import textDefinition from '../samples/SplitButton/SplitButtonText.txt?raw';
import SplitCSharp from '../samples/SplitButton/SplitButtonPage.xaml.cs?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'splitbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.splitbutton'), Description: t('text.the-splitbutton-is-a-dropdown-button-but-with-an'), ToggleTheme: t('gallery.page-header.toggle-theme'), ColorHeader: t('sample.splitbutton.color-picker'), TextHeader: t('sample.splitbutton.text'),
  FontColor: t('sample.splitbutton.font-color'), FontColorWithText: t('sample.splitbutton.font-color-with-text'), ChooseColor: t('sample.choose-color'), Placeholder: t('sample.type-something-here'),
  Red: t('text.red'), Orange: t('sample.orange'), Yellow: t('text.yellow'), Green: t('text.green'), Blue: t('text.blue'), Indigo: t('sample.indigo'), Violet: t('sample.violet'), Gray: t('sample.gray'), Black: t('sample.black')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const CurrentColorValue = ref('Green'), EditorText = ref(t('sample.splitbutton.rich-text'));
let applyingColor = false;
const applyColor = (selectAllIfEmpty = false) => {
  if (applyingColor) return;
  applyingColor = true;
  try {
    const editor = Names.myRichEditBox;
    if (!editor) return;
    if (selectAllIfEmpty && editor.Document.Selection.StartPosition === editor.Document.Selection.EndPosition) editor.Document.Selection.SetRange(0, Number.MAX_SAFE_INTEGER);
    editor.Document.Selection.CharacterFormat.ForegroundColor = CurrentColorValue.value;
  }
  finally { applyingColor = false; }
};
const GridView_ItemClick = async (sender, args) => {
  const rectangle = args?.ClickedItem;
  const color = rectangle?.Fill ?? rectangle?.props?.Fill;
  if (typeof color !== 'string') return;
  CurrentColorValue.value = color;
  applyColor();
  await nextTick();
  Names.myColorButton?.Flyout?.Hide?.();
  Names.myRichEditBox?.Focus('Keyboard');
};
const RevealColorButton_Click = (sender, args) => { Names.myColorButtonReveal?.Flyout?.Hide?.(); };
const myColorButton_Click = (sender, args) => applyColor();
const MyRichEditBox_TextChanged = (sender, args) => applyColor(false);
onMounted(async () => {
  await nextTick();
  applyingColor = true;
  try {
    const editor = Names.myRichEditBox;
    if (editor) { editor.Document.SetText('None', EditorText.value); editor.Document.GetRange(0, Number.MAX_SAFE_INTEGER).CharacterFormat.ForegroundColor = CurrentColorValue.value; }
  }
  finally { applyingColor = false; }
});
const codePart = definition => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const ColorXaml = codePart(colorDefinition), TextXaml = codePart(textDefinition);
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, CurrentColorValue, EditorText, GridView_ItemClick, RevealColorButton_Click, myColorButton_Click, MyRichEditBox_TextChanged, ColorXaml, TextXaml, SplitCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.split-example :deep(.example-display), .split-example :deep(.example-options) { min-width: 0; }
.sample-editor { max-width: 100%; --rich-edit-box-min-height: 96px; }
.sample-editor :deep(.win-reb-editor-scroll), .sample-editor :deep(.win-reb-editor) { min-height: 94px; }
</style>
