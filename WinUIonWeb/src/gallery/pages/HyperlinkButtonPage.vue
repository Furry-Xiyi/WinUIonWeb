<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.hyperlinkbutton'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.a-button-that-appears-as-a-hyperlink'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="HyperlinkButton\HyperlinkButtonNavigate.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind hyperlinkButtonNavigateVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.hyperlink.navigate'), Mode=OneWay}">
              <ControlExample.Example>
                <HyperlinkButton
                  Content="{x:Bind $t('text.microsoft-home-page'), Mode=OneWay}"
                  NavigateUri="https://www.microsoft.com"
                  IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}" />
              </ControlExample.Example>
              <ControlExample.Options>
                <StackPanel>
                  <CheckBox IsChecked="{x:Bind DisableControl1, Mode=TwoWay}">
                    <TextBlock Text="{x:Bind $t('sample.disable-hyperlink-button'), Mode=OneWay}" />
                  </CheckBox>
                </StackPanel>
              </ControlExample.Options>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="HyperlinkButton\HyperlinkButtonClick.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind hyperlinkButtonClickVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.hyperlink.click'), Mode=OneWay}">
              <ControlExample.Example>
                <HyperlinkButton Content="{x:Bind $t('sample.hyperlink.go-to-togglebutton'), Mode=OneWay}" Click="GoToHyperlinkButton_Click" />
              </ControlExample.Example>
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
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const navigate = inject('navigate', () => {});
const pageKey = computed(() => currentPage?.value || 'hyperlinkbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const DisableControl1 = ref(false);

const GoToHyperlinkButton_Click = () => {
  navigate('togglebutton');
};

const hyperlinkButtonNavigateVue = `<HyperlinkButton
  Content="{x:Bind $t('text.microsoft-home-page'), Mode=OneWay}"
  NavigateUri="https://www.microsoft.com"
  IsEnabled="{x:Bind DisableControl1.IsChecked.Value.Equals(x:False), Mode=OneWay}" />`;
const hyperlinkButtonClickVue = `<HyperlinkButton Content="{x:Bind $t('sample.hyperlink.go-to-togglebutton'), Mode=OneWay}" Click="GoToHyperlinkButton_Click" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
