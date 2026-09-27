<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
          <ControlExample SampleDefinition="DropDownButton\DropDownButtonSimple.txt" HeaderText="{x:Bind Labels.SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SimpleXaml, Mode=OneWay}" CSharp="{x:Bind DropDownCSharp}">
            <ControlExample.Example>
              <StackPanel x:Name="Control1" Orientation="Horizontal">
                <DropDownButton Content="{x:Bind Labels.Email, Mode=OneWay}">
                  <DropDownButton.Flyout>
                    <MenuFlyout Placement="BottomEdgeAlignedLeft">
                      <MenuFlyoutItem Text="{x:Bind Labels.Send, Mode=OneWay}" />
                      <MenuFlyoutItem Text="{x:Bind Labels.Reply, Mode=OneWay}" />
                      <MenuFlyoutItem Text="{x:Bind Labels.ReplyAll, Mode=OneWay}" />
                    </MenuFlyout>
                  </DropDownButton.Flyout>
                </DropDownButton>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
          <ControlExample SampleDefinition="DropDownButton\DropDownButtonIcon.txt" HeaderText="{x:Bind Labels.IconHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind IconXaml, Mode=OneWay}" CSharp="{x:Bind DropDownCSharp}">
            <ControlExample.Example>
              <StackPanel x:Name="Control2" Orientation="Horizontal">
                <DropDownButton AutomationProperties.Name="{x:Bind Labels.Email, Mode=OneWay}">
                  <DropDownButton.Content><FontIcon Glyph="&#xE715;" /></DropDownButton.Content>
                  <DropDownButton.Flyout>
                    <MenuFlyout Placement="BottomEdgeAlignedLeft">
                      <MenuFlyoutItem Text="{x:Bind Labels.Send, Mode=OneWay}"><MenuFlyoutItem.Icon><FontIcon Glyph="&#xE725;" /></MenuFlyoutItem.Icon></MenuFlyoutItem>
                      <MenuFlyoutItem Text="{x:Bind Labels.Reply, Mode=OneWay}"><MenuFlyoutItem.Icon><FontIcon Glyph="&#xE8CA;" /></MenuFlyoutItem.Icon></MenuFlyoutItem>
                      <MenuFlyoutItem Text="{x:Bind Labels.ReplyAll, Mode=OneWay}"><MenuFlyoutItem.Icon><FontIcon Glyph="&#xE8C2;" /></MenuFlyoutItem.Icon></MenuFlyoutItem>
                    </MenuFlyout>
                  </DropDownButton.Flyout>
                </DropDownButton>
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
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
import DropDownButton from '../../components/DropDownButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import MenuFlyout from '../../components/MenuFlyout.vue';
import { MenuFlyoutItem } from '../../components/MenuFlyoutItems';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import simpleDefinition from '../samples/DropDownButton/DropDownButtonSimple.txt?raw';
import iconDefinition from '../samples/DropDownButton/DropDownButtonIcon.txt?raw';
import DropDownCSharp from '../samples/DropDownButton/DropDownButtonPage.xaml.cs?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'dropdownbutton');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  PageTitle: t('text.dropdownbutton'),
  Description: t('text.a-dropdownbutton-is-a-button-that-displays-a-che'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  SimpleHeader: t('sample.dropdownbutton.simple'),
  IconHeader: t('sample.dropdownbutton.icons'),
  Email: t('text.email'), Send: t('text.send'), Reply: t('text.reply'), ReplyAll: t('text.reply-all')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const sampleXaml = definition => definition.split('--- xaml')[1]?.split(/\r?\n--- /)[0].trim() ?? '';
const SimpleXaml = sampleXaml(simpleDefinition), IconXaml = sampleXaml(iconDefinition);
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, SimpleXaml, IconXaml, DropDownCSharp });
</script>

<style scoped>
.gallery-item-page, .page-heading { min-width: 0; width: 100%; }
.page-heading { position: relative; }
.page-header { color: var(--text-primary); }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
</style>
