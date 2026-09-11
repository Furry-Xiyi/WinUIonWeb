<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.dropdownbutton'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.a-dropdownbutton-is-a-button-that-displays-a-che'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="DropDownButton\DropDownButtonSimple.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind dropDownButtonSimpleVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.dropdown.simple'), Mode=OneWay}">
              <StackPanel Orientation="Horizontal">
                <DropDownButton Content="{x:Bind $t('text.email'), Mode=OneWay}">
                  <DropDownButton.Flyout>
                    <MenuFlyout Placement="BottomEdgeAlignedLeft">
                      <MenuFlyoutItem Text="{x:Bind $t('text.send'), Mode=OneWay}" />
                      <MenuFlyoutItem Text="{x:Bind $t('text.reply'), Mode=OneWay}" />
                      <MenuFlyoutItem Text="{x:Bind $t('text.reply-all'), Mode=OneWay}" />
                    </MenuFlyout>
                  </DropDownButton.Flyout>
                </DropDownButton>
              </StackPanel>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="DropDownButton\DropDownButtonIcon.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind dropDownButtonIconVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.dropdown.icons'), Mode=OneWay}">
              <StackPanel Orientation="Horizontal">
                <DropDownButton AutomationProperties.Name="Email">
                  <DropDownButton.Content>
                    <FontIcon Glyph="&#xE715;" />
                  </DropDownButton.Content>
                  <DropDownButton.Flyout>
                    <MenuFlyout Placement="BottomEdgeAlignedLeft">
                      <MenuFlyoutItem Text="{x:Bind $t('text.send'), Mode=OneWay}"><MenuFlyoutItem.Icon><FontIcon Glyph="&#xE725;" /></MenuFlyoutItem.Icon></MenuFlyoutItem>
                      <MenuFlyoutItem Text="{x:Bind $t('text.reply'), Mode=OneWay}"><MenuFlyoutItem.Icon><FontIcon Glyph="&#xE8CA;" /></MenuFlyoutItem.Icon></MenuFlyoutItem>
                      <MenuFlyoutItem Text="{x:Bind $t('text.reply-all'), Mode=OneWay}"><MenuFlyoutItem.Icon><FontIcon Glyph="&#xE8C2;" /></MenuFlyoutItem.Icon></MenuFlyoutItem>
                    </MenuFlyout>
                  </DropDownButton.Flyout>
                </DropDownButton>
              </StackPanel>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import DropDownButton from '../../components/DropDownButton.vue';
import { MenuFlyout, MenuFlyoutItem } from '../../components/DropDownButtonProperties';
import FontIcon from '../../components/FontIcon.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'dropdownbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const dropDownButtonSimpleVue = `<DropDownButton Content="{x:Bind $t('text.email'), Mode=OneWay}">
  <DropDownButton.Flyout>
    <MenuFlyout Placement="BottomEdgeAlignedLeft">
      <MenuFlyoutItem Text="{x:Bind $t('text.send'), Mode=OneWay}" />
      <MenuFlyoutItem Text="{x:Bind $t('text.reply'), Mode=OneWay}" />
      <MenuFlyoutItem Text="{x:Bind $t('text.reply-all'), Mode=OneWay}" />
    </MenuFlyout>
  </DropDownButton.Flyout>
</DropDownButton>`;
const dropDownButtonIconVue = `<DropDownButton AutomationProperties.Name="Email">
  <DropDownButton.Content>
    <FontIcon Glyph="&#xE715;" />
  </DropDownButton.Content>
  <DropDownButton.Flyout>
    <MenuFlyout Placement="BottomEdgeAlignedLeft">
      <MenuFlyoutItem Text="{x:Bind $t('text.send'), Mode=OneWay}">
        <MenuFlyoutItem.Icon><FontIcon Glyph="&#xE725;" /></MenuFlyoutItem.Icon>
      </MenuFlyoutItem>
      <MenuFlyoutItem Text="{x:Bind $t('text.reply'), Mode=OneWay}">
        <MenuFlyoutItem.Icon><FontIcon Glyph="&#xE8CA;" /></MenuFlyoutItem.Icon>
      </MenuFlyoutItem>
      <MenuFlyoutItem Text="{x:Bind $t('text.reply-all'), Mode=OneWay}">
        <MenuFlyoutItem.Icon><FontIcon Glyph="&#xE8C2;" /></MenuFlyoutItem.Icon>
      </MenuFlyoutItem>
    </MenuFlyout>
  </DropDownButton.Flyout>
</DropDownButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
