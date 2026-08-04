<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.togglebutton')" />
          <WinTextBlock
            class="page-description"
            :Text="$t('text.a-togglebutton-looks-like-a-button-but-works-lik')"
            TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton
              class="header-action"
              @Click="toggleTheme"
              >
              <span class="icon"></span>
            </WinButton>
            <WinToggleButton
              :IsChecked="isFavoriteState"
              class="header-action"
              @update:IsChecked="toggleFavorite"
              >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample
              class="basic-input-example-theme"
              :headerText="$t('sample.togglebutton.simple')"
              :theme="pageTheme"
              :vue="toggleButtonVue">
              <template #example>
                <WinToggleButton v-model:IsChecked="Toggle1"
                  :Content="$t('text.togglebutton')"
                  :IsEnabled="DisableToggle1 !== true"
                  @Checked="ToggleButton_Checked"
                  @Unchecked="ToggleButton_Unchecked" />
              </template>

              <template #options>
                <WinTextBlock class="output-text" :Text="Control1Output" />
                <WinCheckBox v-model="DisableToggle1">
                  <WinTextBlock :Text="$t('sample.disable-togglebutton')" />
                </WinCheckBox>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'togglebutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const Toggle1 = ref(false);
const DisableToggle1 = ref(false);
const Control1Output = ref(Toggle1.value === true ? 'On' : 'Off');

const ToggleButton_Checked = () => {
  Control1Output.value = 'On';
};

const ToggleButton_Unchecked = () => {
  Control1Output.value = 'Off';
};

const toggleButtonVue = `<WinToggleButton v-model:IsChecked="Toggle1"
  Content="ToggleButton"
  :IsEnabled="DisableToggle1 !== true"
  @Checked="ToggleButton_Checked"
  @Unchecked="ToggleButton_Unchecked" />`;

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
