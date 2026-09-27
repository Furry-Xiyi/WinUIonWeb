<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions"><Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button><ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton></div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="toggle-split-example" SampleDefinition="ToggleSplitButton\ToggleSplitButtonBulletList.txt" WebViewHeight="150" HeaderText="{x:Bind Labels.BulletListHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ToggleSplitXaml}" CSharp="{x:Bind ToggleSplitCSharp}">
          <ControlExample.Example>
            <ToggleSplitButton x:Name="myListButton" VerticalAlignment="Top" AutomationProperties.Name="{x:Bind ListAutomationName, Mode=OneWay}" IsChecked="{x:Bind IsListChecked, Mode=TwoWay}" IsCheckedChanged="MyListButton_IsCheckedChanged">
              <SymbolIcon x:Name="mySymbolIcon" Symbol="{x:Bind ListSymbol, Mode=OneWay}" />
              <ToggleSplitButton.Flyout><Flyout Placement="Bottom">
                <StackPanel Orientation="Horizontal">
                  <StackPanel.Resources><Style TargetType="Button"><Setter Property="Padding" Value="4" /><Setter Property="MinWidth" Value="0" /><Setter Property="MinHeight" Value="0" /><Setter Property="Margin" Value="6" /><Setter Property="CornerRadius" Value="{StaticResource ControlCornerRadius}" /></Style></StackPanel.Resources>
                  <Button AutomationProperties.Name="{x:Bind Labels.BulletedList, Mode=OneWay}" Click="BulletButton_Click"><SymbolIcon Symbol="List" /></Button>
                  <Button AutomationProperties.Name="{x:Bind Labels.RomanNumeralsList, Mode=OneWay}" Click="BulletButton_Click"><SymbolIcon Symbol="Bullets" /></Button>
                </StackPanel>
              </Flyout></ToggleSplitButton.Flyout>
            </ToggleSplitButton>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options><RichEditBox x:Name="myRichEditBox" class="sample-editor" Width="240" MinHeight="96" AutomationProperties.Name="{x:Bind Labels.TextEntry, Mode=OneWay}" /></ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, nextTick, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Flyout from '../../components/Flyout.vue';
import FontIcon from '../../components/FontIcon.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import SymbolIcon from '../../components/SymbolIcon.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSplitButton from '../../components/ToggleSplitButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import toggleSplitDefinition from '../samples/ToggleSplitButton/ToggleSplitButtonBulletList.txt?raw';
import ToggleSplitCSharp from '../samples/ToggleSplitButton/ToggleSplitButtonPage.xaml.cs?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'togglesplitbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({ PageTitle: t('text.togglesplitbutton'), Description: t('text.a-button-that-can-be-toggled-on-off-with-additio'), ToggleTheme: t('gallery.page-header.toggle-theme'), BulletListHeader: t('sample.togglesplitbutton.bullet-list'), BulletedList: t('sample.togglesplitbutton.bulleted-list'), RomanNumeralsList: t('sample.togglesplitbutton.roman-numerals-list'), TextEntry: t('sample.togglesplitbutton.text-entry') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const IsListChecked = ref(false), ListSymbol = ref('List');
const ListAutomationName = computed(() => t(ListSymbol.value === 'List' ? 'sample.togglesplitbutton.bullets' : 'sample.togglesplitbutton.roman-numerals'));
const applyListState = async checked => {
  await nextTick();
  const editor = Names.myRichEditBox;
  if (!editor) return;
  editor.Document.Selection.ParagraphFormat.ListType = checked ? (ListSymbol.value === 'List' ? 'Bullet' : 'UpperRoman') : 'None';
  editor.Focus('Keyboard');
};
const BulletButton_Click = async (sender, args) => {
  const content = sender?.Content;
  const symbol = content?.Symbol ?? content?.props?.Symbol;
  if (symbol !== 'List' && symbol !== 'Bullets') return;
  ListSymbol.value = symbol;
  IsListChecked.value = true;
  await applyListState(true);
  Names.myListButton?.Flyout?.Hide?.();
  Names.myRichEditBox?.Focus('Keyboard');
};
const MyListButton_IsCheckedChanged = (sender, args) => { IsListChecked.value = Boolean(sender?.IsChecked); void applyListState(IsListChecked.value); };
const ToggleSplitXaml = (toggleSplitDefinition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '').replace('Click="myListButton_Click"', 'IsCheckedChanged="MyListButton_IsCheckedChanged"');
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, IsListChecked, ListSymbol, ListAutomationName, BulletButton_Click, MyListButton_IsCheckedChanged, ToggleSplitXaml, ToggleSplitCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.toggle-split-example :deep(.example-display), .toggle-split-example :deep(.example-options) { min-width: 0; }
.sample-editor { max-width: 100%; --rich-edit-box-min-height: 96px; }
.sample-editor :deep(.win-reb-editor-scroll), .sample-editor :deep(.win-reb-editor) { min-height: 94px; }
</style>
