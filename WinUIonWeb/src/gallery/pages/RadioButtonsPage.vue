<template>
  <div>
    <div class="page-heading">
      <TextBlock class="page-header" :Text="$t('text.radiobuttons')" />
      <TextBlock class="page-description" :Text="$t('text.radiobuttons-are-used-to-select-a-single-option')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
        <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </ToggleButton>
      </div>
    </div>

    <ControlExample class="basic-input-example-theme" :headerText="$t('sample.radiobutton.group')" :theme="pageTheme" :vue="radioButtonGroupVue">
      <template #example>
        <RadioButton
          :Header="$t('text.options')"
          :SelectedIndex="selectedOptionIndex"
          @SelectionChanged="onOptionSelectionChanged">
          <RadioButton :Content="$t('text.option-1')" />
          <RadioButton :Content="$t('text.option-2')" />
          <RadioButton :Content="$t('text.option-3')" />
        </RadioButton>
      </template>
      <template #options>
        <TextBlock :Text="optionOutputText" />
      </template>
    </ControlExample>

    <ControlExample class="basic-input-example-theme" :headerText="$t('sample.radiobutton.strings')" :theme="pageTheme" :vue="radioButtonStringsVue">
      <template #example>
        <div class="vertical-stack">
          <RadioButton
            :Header="$t('sample.background')"
            :ItemsSource="colorItems"
            MaxColumns="3"
            :SelectedIndex="backgroundIndex"
            @SelectionChanged="backgroundIndex = $event.SelectedIndex" />
          <RadioButton
            :Header="$t('sample.border')"
            :ItemsSource="colorItems"
            MaxColumns="3"
            :SelectedIndex="borderIndex"
            @SelectionChanged="borderIndex = $event.SelectedIndex" />
          <div class="radio-color-output" :style="colorOutputStyle" />
        </div>
      </template>
    </ControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import RadioButton from '../../components/RadioButton.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
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

const radioButtonGroupVue = `<RadioButton Header="Options:">
  <RadioButton Content="Option 1" />
  <RadioButton Content="Option 2" />
  <RadioButton Content="Option 3" />
</RadioButton>`;

const radioButtonStringsVue = `<RadioButton Header="Background" MaxColumns="3" :SelectedIndex="0" :ItemsSource="['Green', 'Yellow', 'White']" />
<RadioButton Header="Border" MaxColumns="3" :SelectedIndex="1" :ItemsSource="['Green', 'Yellow', 'White']" />

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
