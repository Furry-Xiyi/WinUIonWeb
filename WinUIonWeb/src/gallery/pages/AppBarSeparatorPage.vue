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
        <ControlExample class="appbar-separator-example" SampleDefinition="AppBarSeparator\AppbarbuttonsSeparatedAppbarseparators.txt" HeaderText="{x:Bind Labels.Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SeparatorXaml}">
          <ControlExample.Example>
            <ScrollViewer HorizontalScrollBarVisibility="Hidden" HorizontalScrollMode="Auto" VerticalScrollBarVisibility="Hidden" VerticalScrollMode="Disabled">
              <CommandBar x:Name="Control1">
                <CommandBar.PrimaryCommands>
                  <AppBarButton Icon="AttachCamera" Label="{x:Bind Labels.AttachCamera, Mode=OneWay}" />
                  <AppBarSeparator />
                  <AppBarButton Icon="Like" Label="{x:Bind Labels.Like, Mode=OneWay}" />
                  <AppBarButton Icon="Dislike" Label="{x:Bind Labels.Dislike, Mode=OneWay}" />
                  <AppBarSeparator />
                  <AppBarButton Icon="Orientation" Label="{x:Bind Labels.Orientation, Mode=OneWay}" />
                </CommandBar.PrimaryCommands>
              </CommandBar>
            </ScrollViewer>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import AppBarSeparator from '../../components/AppBarSeparator.vue';
import Button from '../../components/Button.vue';
import CommandBar from '../../components/CommandBar.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import separatorDefinition from '../samples/AppBarSeparator/AppbarbuttonsSeparatedAppbarseparators.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'appbarseparator');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.appbarseparator'), Description: t('text.appbarseparator-description'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header: t('sample.appbarseparator.separated'),
  AttachCamera: t('sample.appbarseparator.attach-camera'), Like: t('sample.appbarseparator.like'), Dislike: t('sample.appbarseparator.dislike'), Orientation: t('sample.appbarseparator.orientation')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const SeparatorXaml = separatorDefinition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.gallery-item-page { min-width: 0; width: 100%; }
.appbar-separator-example :deep(.example-display) { min-width: 0; max-width: 100%; }
:global(.appbar-separator-example .example-display > .win-scroll-viewer) {
  justify-self: start !important;
  width: max-content !important;
  max-width: 100%;
}
:global(.appbar-separator-example .example-display > .win-scroll-viewer .win-commandbar) {
  justify-self: start !important;
  width: max-content !important;
  max-width: 100%;
}
</style>
