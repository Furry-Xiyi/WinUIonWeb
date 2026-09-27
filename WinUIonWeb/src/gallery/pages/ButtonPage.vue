<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
        </div>
      </div>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="button-example" SampleDefinition="Button\ButtonSimple.txt" HeaderText="{x:Bind Labels.SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SimpleXaml, Mode=OneWay}" CSharp="{x:Bind ButtonCSharp}">
          <ControlExample.Example><Button x:Name="Button1" AutomationProperties.Name="{x:Bind Labels.StandardName, Mode=OneWay}" Click="Button_Click" Content="{x:Bind Labels.StandardButton, Mode=OneWay}" IsEnabled="{x:Bind DisableButton1.IsChecked.Value.Equals(x:False), Mode=OneWay}" /></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control1Output" FontFamily="Global User Interface" Text="{x:Bind Output1, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options><StackPanel><CheckBox x:Name="DisableButton1" Content="{x:Bind Labels.DisableButton, Mode=OneWay}" IsChecked="{x:Bind IsButtonDisabled, Mode=TwoWay}" /></StackPanel></ControlExample.Options>
          <ControlExample.Substitutions><ControlExampleSubstitution Key="IsEnabled" IsEnabled="{x:Bind DisableButton1.IsChecked.Value, Mode=OneWay}" Value="IsEnabled=&quot;False&quot; " /></ControlExample.Substitutions>
        </ControlExample>
        <ControlExample x:Name="Example2" class="button-example" SampleDefinition="Button\ButtonWithImage.txt" HeaderText="{x:Bind Labels.ImageHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ImageXaml}" CSharp="{x:Bind ButtonCSharp}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><Button x:Name="Button2" Width="50" Height="50" AutomationProperties.Name="{x:Bind Labels.Pie, Mode=OneWay}" Click="Button_Click"><Image AutomationProperties.Name="{x:Bind Labels.Slice, Mode=OneWay}" Source="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png" /></Button></StackPanel></ControlExample.Example>
          <ControlExample.Output><TextBlock x:Name="Control2Output" Text="{x:Bind Output2, Mode=OneWay}" TextWrapping="Wrap" AutomationProperties.LiveSetting="Polite" /></ControlExample.Output>
          <ControlExample.Options />
        </ControlExample>
        <ControlExample class="button-example" SampleDefinition="Button\ButtonBuiltInStyles.txt" HeaderText="{x:Bind Labels.StylesHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind StylesXaml}">
          <ControlExample.Example><StackPanel Orientation="Horizontal" Spacing="16"><Button AutomationProperties.Name="{x:Bind Labels.AccentName, Mode=OneWay}" Content="{x:Bind Labels.AccentButton, Mode=OneWay}" Style="{StaticResource AccentButtonStyle}" /><Button AutomationProperties.Name="{x:Bind Labels.SubtleName, Mode=OneWay}" Content="{x:Bind Labels.SubtleButton, Mode=OneWay}" Style="{StaticResource SubtleButtonStyle}" /></StackPanel></ControlExample.Example>
          <ControlExample.Output /><ControlExample.Options />
        </ControlExample>
        <ControlExample class="button-example" SampleDefinition="Button\ButtonWrapping.txt" HeaderText="{x:Bind Labels.WrappingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind WrappingXaml}">
          <ControlExample.Example>
            <StackPanel>
              <TextBlock Margin="0,0,0,8" Text="{x:Bind Labels.WrappingNote1, Mode=OneWay}" TextWrapping="Wrap" />
              <TextBlock Margin="0,0,0,8" Text="{x:Bind Labels.WrappingNote2, Mode=OneWay}" TextWrapping="Wrap" />
              <Button Margin="0,0,0,5" HorizontalAlignment="Stretch" Content="{x:Bind Labels.LongText1, Mode=OneWay}" />
              <Button HorizontalAlignment="Stretch" Content="{x:Bind Labels.LongText2, Mode=OneWay}" />
              <TextBlock Margin="0,8,0,8" Text="{x:Bind Labels.WrappingNote3, Mode=OneWay}" TextWrapping="Wrap" />
              <StackPanel class="wrapping-buttons" HorizontalAlignment="Center" Orientation="Horizontal"><Button MaxWidth="240" Margin="0,0,8,0"><TextBlock Text="{x:Bind Labels.LongWrappingText1, Mode=OneWay}" TextWrapping="WrapWholeWords" /></Button><Button MaxWidth="240"><TextBlock Text="{x:Bind Labels.LongWrappingText2, Mode=OneWay}" TextWrapping="WrapWholeWords" /></Button></StackPanel>
            </StackPanel>
          </ControlExample.Example>
          <ControlExample.Output /><ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import Image from '../../components/Image.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import simpleDefinition from '../samples/Button/ButtonSimple.txt?raw';
import imageDefinition from '../samples/Button/ButtonWithImage.txt?raw';
import stylesDefinition from '../samples/Button/ButtonBuiltInStyles.txt?raw';
import wrappingDefinition from '../samples/Button/ButtonWrapping.txt?raw';
import ButtonCSharp from '../samples/Button/ButtonPage.xaml.cs?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'button');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.button'), Description: t('text.the-button-control-provides-a-click-event-to-res'), ToggleTheme: t('gallery.page-header.toggle-theme'),
  SimpleHeader: t('text.a-simple-button-with-text-content'), ImageHeader: t('sample.button.with-image'), StylesHeader: t('sample.button.built-in-styles'), WrappingHeader: t('sample.button.wrapping'),
  StandardName: t('sample.button.standard-name'), StandardButton: t('sample.button.standard-xaml'), DisableButton: t('sample.button.disable'), Pie: t('sample.button.pie'), Slice: t('sample.button.slice'),
  AccentName: t('sample.button.accent-name'), AccentButton: t('sample.button.accent-style'), SubtleName: t('sample.button.subtle-name'), SubtleButton: t('sample.button.subtle-style'),
  WrappingNote1: t('sample.button.wrapping-note-1'), WrappingNote2: t('sample.button.wrapping-note-2'), WrappingNote3: t('sample.button.wrapping-note-3'), LongText1: t('sample.button.long-text-1'), LongText2: t('sample.button.long-text-2'), LongWrappingText1: t('sample.button.long-text-1-wrapping'), LongWrappingText2: t('sample.button.long-text-2-wrapping')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const IsButtonDisabled = ref(false), clickedNames = ref(['', '']);
const Output1 = computed(() => clickedNames.value[0] ? t('sample.you-clicked', { name: clickedNames.value[0] }) : '');
const Output2 = computed(() => clickedNames.value[1] ? t('sample.you-clicked', { name: clickedNames.value[1] }) : '');
const Button_Click = (sender, args) => { const name = sender?.Name; if (name === 'Button1') clickedNames.value[0] = name; if (name === 'Button2') clickedNames.value[1] = name; };
const codePart = definition => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const SimpleXaml = computed(() => codePart(simpleDefinition).replace('$(IsEnabled)', IsButtonDisabled.value ? 'IsEnabled="False" ' : ''));
const ImageXaml = codePart(imageDefinition), StylesXaml = codePart(stylesDefinition), WrappingXaml = codePart(wrappingDefinition);
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, IsButtonDisabled, Output1, Output2, Button_Click, SimpleXaml, ImageXaml, StylesXaml, WrappingXaml, ButtonCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.button-example :deep(.example-display), .button-example :deep(.example-output) { min-width: 0; }
.button-example :deep(.example-output) { overflow-wrap: anywhere; }
.wrapping-buttons { max-width: 100%; }
.wrapping-buttons :deep(> .win-btn) { flex-shrink: 1; min-width: 0; }
</style>
