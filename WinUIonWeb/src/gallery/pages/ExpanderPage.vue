<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.expander'), Mode=OneWay}" />
        <TextBlock
          class="page-description"
          Text="{x:Bind $t('text.the-expander-control-lets-you-show-or-hide-less'), Mode=OneWay}"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
          <ToggleButton
            IsChecked="{x:Bind isFavoriteState, Mode=OneWay}"
            class="header-action"
            Click="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          SampleDefinition="Expander\ExpanderTextHeaderContent.txt"
          ExampleHeight="160"
          HeaderText="{x:Bind $t('sample.expander.text-header-content'), Mode=OneWay}"
          Theme="{x:Bind pageTheme, Mode=OneWay}"
          Vue="{x:Bind example1Code, Mode=OneWay}">
          <ControlExample.Example>
            <Expander
              IsExpanded="{x:Bind expander1Expanded, Mode=TwoWay}"
              ExpandDirection="{x:Bind expandDirection, Mode=OneWay}"
              Header="{x:Bind $t('sample.expander.header-text'), Mode=OneWay}"
              Content="{x:Bind $t('sample.expander.content-text'), Mode=OneWay}"
              VerticalAlignment="{x:Bind verticalAlignment, Mode=OneWay}">
            </Expander>
          </ControlExample.Example>
          <ControlExample.Options>
            <StackPanel>
              <ComboBox
                SelectedIndex="{x:Bind expandDirectionIndex, Mode=TwoWay}"
                Header="ExpandDirection"
                Width="196"
                ItemsSource="{x:Bind expandDirectionItems, Mode=OneWay}"
                DisplayMemberPath="Text" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          SampleDefinition="Expander\ModifyingExpandersContentAlignment.txt"
          HeaderText="{x:Bind $t('sample.expander.content-alignment'), Mode=OneWay}"
          Theme="{x:Bind pageTheme, Mode=OneWay}"
          Vue="{x:Bind example2Code, Mode=OneWay}">
          <ControlExample.Example>
            <Expander Width="500" MaxWidth="100%" Padding="0" HorizontalContentAlignment="Left">
              <Expander.Header>
                <TextBlock
                  class="centered-header-text"
                  HorizontalTextAlignment="Center"
                  Text="{x:Bind $t('sample.expander.centered-header'), Mode=OneWay}" />
              </Expander.Header>
              <Expander.Content>
                <TextBlock Margin="4" Text="{x:Bind $t('sample.expander.left-aligned-content'), Mode=OneWay}" />
              </Expander.Content>
            </Expander>
          </ControlExample.Example>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ComboBox from '../../components/ComboBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import Expander from '../../components/Expander.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'expander');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const expander1Expanded = ref(false);
const expandDirectionIndex = ref(0);
const expandDirectionItems = computed(() => [
  { Text: t('text.down'), Value: 'Down' },
  { Text: t('text.up'), Value: 'Up' }
]);
const expandDirection = computed(() => expandDirectionItems.value[expandDirectionIndex.value]?.Value ?? 'Down');
const verticalAlignment = computed(() => expandDirection.value === 'Up' ? 'Bottom' : 'Top');

const example1Code = computed(() => `<Expander
  IsExpanded="${expander1Expanded.value ? 'True' : 'False'}"
  ExpandDirection="${expandDirection.value}"
  Header="${t('sample.expander.header-text')}"
  Content="${t('sample.expander.content-text')}"
  VerticalAlignment="${verticalAlignment.value}" />`);

const example2Code = computed(() => `<Expander Width="500" Padding="0" HorizontalContentAlignment="Left">
  <Expander.Header>
    <TextBlock HorizontalTextAlignment="Center" Text="${t('sample.expander.centered-header')}" />
  </Expander.Header>
  <Expander.Content>
    <TextBlock Margin="4" Text="${t('sample.expander.left-aligned-content')}" />
  </Expander.Content>
</Expander>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.centered-header-text { width: 100%; }
</style>
