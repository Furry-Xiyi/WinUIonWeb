<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.repeatbutton'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.a-button-that-raises-its-click-event-repeatedly-ecf7f2'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="RepeatButton\RepeatButtonSimple.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind repeatButtonSimpleVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.repeat.simple'), Mode=OneWay}">
              <StackPanel Orientation="Horizontal">
                <RepeatButton Content="{x:Bind $t('text.click-and-hold'), Mode=OneWay}" IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}" Click="RepeatButton_Click" />
                <TextBlock Margin="8,0,0,0" VerticalAlignment="Center" AutomationProperties.LiveSetting="Polite" AutomationProperties.Name="Control output" Text="{x:Bind Control1Output, Mode=OneWay}" />
              </StackPanel>
              <ControlExample.Options>
                <CheckBox IsChecked="{x:Bind DisableControl1, Mode=TwoWay}">
                  <TextBlock Text="{x:Bind $t('sample.disable-repeatbutton'), Mode=OneWay}" />
                </CheckBox>
              </ControlExample.Options>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import RepeatButton from '../../components/RepeatButton.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'repeatbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const DisableControl1 = ref(false);
const clicks = ref(0);
const Control1Output = ref('');

const RepeatButton_Click = () => {
  clicks.value += 1;
  Control1Output.value = t('sample.number-of-clicks', { count: clicks.value });
};

const repeatButtonSimpleVue = `<StackPanel Orientation="Horizontal">
  <RepeatButton
    Content="{x:Bind $t('text.click-and-hold'), Mode=OneWay}"
    IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
    Click="RepeatButton_Click" />
  <TextBlock
    Margin="8,0,0,0"
    VerticalAlignment="Center"
    AutomationProperties.LiveSetting="Polite"
    AutomationProperties.Name="Control output"
    Text="{x:Bind Control1Output, Mode=OneWay}" />
</StackPanel>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.horizontal-stack { display: flex; align-items: center; }
.icon { font-size: 16px; }
</style>
