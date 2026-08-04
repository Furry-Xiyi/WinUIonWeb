<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" :Text="$t('text.radiobuttons')" />
      <WinTextBlock class="page-description" :Text="$t('text.radiobuttons-are-used-to-select-a-single-option')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
        <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.radiobutton.group')" :theme="pageTheme" :vue="radioButtonGroupVue">
      <template #example>
        <WinRadioButton
          :Header="$t('text.options')"
          :SelectedIndex="selectedOptionIndex"
          @SelectionChanged="onOptionSelectionChanged">
          <WinRadioButton :Content="$t('text.option-1')" />
          <WinRadioButton :Content="$t('text.option-2')" />
          <WinRadioButton :Content="$t('text.option-3')" />
        </WinRadioButton>
      </template>
      <template #options>
        <WinTextBlock :Text="optionOutputText" />
      </template>
    </WinControlExample>

    <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.radiobutton.strings')" :theme="pageTheme" :vue="radioButtonStringsVue">
      <template #example>
        <div class="vertical-stack">
          <WinRadioButton
            :Header="$t('sample.background')"
            :ItemsSource="colorItems"
            MaxColumns="3"
            :SelectedIndex="backgroundIndex"
            @SelectionChanged="backgroundIndex = $event.SelectedIndex" />
          <WinRadioButton
            :Header="$t('sample.border')"
            :ItemsSource="colorItems"
            MaxColumns="3"
            :SelectedIndex="borderIndex"
            @SelectionChanged="borderIndex = $event.SelectedIndex" />
          <div class="radio-color-output" :style="colorOutputStyle" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'radiobuttons');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const selectedOptionIndex = ref(-1);
const backgroundIndex = ref(2);
const borderIndex = ref(1);

const optionItems = computed(() => [t('text.option-1'), t('text.option-2'), t('text.option-3')]);
const colorItems = computed(() => [t('text.green'), t('text.yellow'), t('text.white')]);
const optionOutputText = computed(() => selectedOptionIndex.value < 0
  ? t('sample.select-an-option')
  : t('sample.you-selected', { option: optionItems.value[selectedOptionIndex.value] }));

const backgroundColors = ['#008000', '#FFFF00', '#FFFFFF'];
const borderColors = ['#006400', '#FFD700', '#FFFFFF'];
const colorOutputStyle = computed(() => ({
  backgroundColor: backgroundColors[backgroundIndex.value],
  borderColor: borderColors[borderIndex.value]
}));

const onOptionSelectionChanged = (event) => {
  selectedOptionIndex.value = event.SelectedIndex;
};

const radioButtonGroupVue = `<WinRadioButton Header="Options:">
  <WinRadioButton Content="Option 1" />
  <WinRadioButton Content="Option 2" />
  <WinRadioButton Content="Option 3" />
</WinRadioButton>`;

const radioButtonStringsVue = `<WinRadioButton Header="Background" MaxColumns="3" :SelectedIndex="0" :ItemsSource="['Green', 'Yellow', 'White']" />
<WinRadioButton Header="Border" MaxColumns="3" :SelectedIndex="1" :ItemsSource="['Green', 'Yellow', 'White']" />

<div style="height: 50px; margin: 0 10px; border: 10px solid #FFD700; background: #FFFFFF;" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.vertical-stack { display: flex; flex-direction: column; align-items: flex-start; }
.radio-color-output { width: 100%; height: 50px; box-sizing: border-box; margin: 10px 0; border: 10px solid; }
</style>
