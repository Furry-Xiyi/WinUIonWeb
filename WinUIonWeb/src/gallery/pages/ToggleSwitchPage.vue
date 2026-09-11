<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.toggleswitch'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.use-toggleswitch-controls-to-present-users-with'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="ToggleSwitch\ToggleSwitchSimple.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind toggleSwitchSimpleVue, Mode=OneWay}" HeaderText="{x:Bind $t('text.a-simple-toggleswitch'), Mode=OneWay}">
              <ControlExample.Example>
                <ToggleSwitch />
              </ControlExample.Example>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="ToggleSwitch\ToggleSwitchCustom.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind toggleSwitchCustomVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.toggleswitch.custom'), Mode=OneWay}">
              <ControlExample.Example>
                <StackPanel Orientation="Horizontal">
                  <ToggleSwitch
                    Header="{x:Bind $t('sample.toggle-work'), Mode=OneWay}"
                    OffContent="{x:Bind $t('sample.do-work'), Mode=OneWay}"
                    OnContent="{x:Bind $t('sample.working'), Mode=OneWay}"
                    IsOn="{x:Bind workToggle, Mode=TwoWay}" />
                  <ProgressRing Width="32" IsActive="{x:Bind workToggle, Mode=OneWay}" />
                </StackPanel>
              </ControlExample.Example>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import ProgressRing from '../../components/ProgressRing.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'toggleswitch');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const workToggle = ref(true);

const toggleSwitchSimpleVue = `<ToggleSwitch AutomationProperties.Name="simple ToggleSwitch" />`;
const toggleSwitchCustomVue = `<StackPanel Orientation="Horizontal">
  <ToggleSwitch Header="{x:Bind $t('sample.toggle-work'), Mode=OneWay}" OffContent="{x:Bind $t('sample.do-work'), Mode=OneWay}" OnContent="{x:Bind $t('sample.working'), Mode=OneWay}" IsOn="{x:Bind true, Mode=OneWay}" />
  <ProgressRing IsActive="{x:Bind true, Mode=OneWay}" Width="32" />
</StackPanel>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.horizontal-stack { display: flex; align-items: center; gap: 0; }
</style>
