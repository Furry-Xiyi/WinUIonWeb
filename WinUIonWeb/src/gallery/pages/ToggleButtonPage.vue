<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.togglebutton'), Mode=OneWay}" />
          <TextBlock
            class="page-description"
            Text="{x:Bind $t('text.a-togglebutton-looks-like-a-button-but-works-lik'), Mode=OneWay}"
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button
              class="header-action"
              Click="toggleTheme"
              >
              <span class="icon"></span>
            </Button>
            <ToggleButton
              IsChecked="{x:Bind isFavoriteState, Mode=OneWay}"
              class="header-action"
              Click="toggleFavorite"
              >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample
              class="basic-input-example-theme"
              SampleDefinition="ToggleButton\ToggleButtonSimple.txt"
              HeaderText="{x:Bind $t('sample.togglebutton.simple'), Mode=OneWay}"
              Theme="{x:Bind pageTheme, Mode=OneWay}"
              Vue="{x:Bind toggleButtonVue, Mode=OneWay}">
              <StackPanel Orientation="Horizontal" VerticalAlignment="Top">
                <ToggleButton IsChecked="{x:Bind Toggle1, Mode=TwoWay}"
                  Content="{x:Bind $t('text.togglebutton'), Mode=OneWay}"
                  IsEnabled="{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
                  Checked="ToggleButton_Checked"
                  Unchecked="ToggleButton_Unchecked" />
              </StackPanel>

              <ControlExample.Output>
                <TextBlock class="output-text" Text="{x:Bind Control1Output, Mode=OneWay}" />
              </ControlExample.Output>
              <ControlExample.Options>
                <StackPanel>
                  <CheckBox IsChecked="{x:Bind DisableToggle1, Mode=TwoWay}">
                    <TextBlock Text="{x:Bind $t('sample.disable-togglebutton'), Mode=OneWay}" />
                  </CheckBox>
                </StackPanel>
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
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'togglebutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const { t } = useI18n();
const Toggle1 = ref(false);
const DisableToggle1 = ref(false);
const Control1Output = ref(Toggle1.value === true ? t('sample.togglebutton.on') : t('sample.togglebutton.off'));

const ToggleButton_Checked = () => {
  Control1Output.value = t('sample.togglebutton.on');
};

const ToggleButton_Unchecked = () => {
  Control1Output.value = t('sample.togglebutton.off');
};

const toggleButtonVue = `<StackPanel Orientation="Horizontal" VerticalAlignment="Top">
  <ToggleButton IsChecked="{x:Bind Toggle1, Mode=TwoWay}"
    Content="{x:Bind $t('text.togglebutton'), Mode=OneWay}"
    IsEnabled="{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
    Checked="ToggleButton_Checked"
    Unchecked="ToggleButton_Unchecked" />
</StackPanel>`;

</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
