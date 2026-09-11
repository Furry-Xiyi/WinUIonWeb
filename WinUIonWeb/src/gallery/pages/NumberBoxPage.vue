<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.numberbox')" />
          <TextBlock class="page-description" :Text="$t('text.the-numberbox-control-allows-users-to-enter-numb')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('text.a-numberbox-that-evaluates-expressions')">
              <template #example>
                <NumberBox v-model:Value="expressionValue" :AcceptsExpression="true" :Header="$t('text.enter-an-expression')" PlaceholderText="1 + 2^2" :Width="300" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.numberbox.spin-button')">
              <template #example>
                <NumberBox v-model:Value="spinValue" :Header="$t('sample.numberbox.enter-integer')" :SmallChange="10" :LargeChange="100" :SpinButtonPlacementMode="spinMode" :Width="300" />
              </template>
              <template #options>
                <div class="options-group">
                  <TextBlock class="options-label" :Text="$t('sample.numberbox.spinbutton-placement')" />
                  <RadioButton v-model="spinMode" value="Inline"><TextBlock :Text="$t('text.inline')" /></RadioButton>
                  <RadioButton v-model="spinMode" value="Compact"><TextBlock :Text="$t('sample.numberbox.compact')" /></RadioButton>
                </div>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template" :headerText="$t('sample.numberbox.formatted-rounding')">
              <template #example>
                <div class="stack-example">
                  <NumberBox v-model:Value="currencyValue" :NumberFormatter="currencyFormatter" :Header="$t('sample.numberbox.enter-dollar-amount')" PlaceholderText="0.00" :SmallChange="0.25" :Width="300" @ValueChanged="roundCurrency" />
                  <TextBlock class="output-text" :Text="currencyOutput" />
                </div>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import NumberBox from '../../components/NumberBox.vue';
import RadioButton from '../../components/RadioButton.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t, locale } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'numberbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const expressionValue = ref(Number.NaN);
const spinValue = ref(10);
const spinMode = ref('Compact');
const currencyValue = ref(Number.NaN);
const currencyOutput = ref('');
const currencyFormatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

const formatCurrency = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
const roundCurrency = ({ NewValue }) => {
  if (Number.isNaN(NewValue)) {
    currencyOutput.value = '';
    return;
  }
  const rounded = Math.round(NewValue * 4) / 4;
  currencyValue.value = rounded;
  currencyOutput.value = formatCurrency(rounded);
};

const example1Template = computed(() => `<NumberBox
  v-model:Value="expressionValue"
  :AcceptsExpression="true"
  Header="${t('text.enter-an-expression')}"
  PlaceholderText="1 + 2^2" />`);

const example2Template = computed(() => `<NumberBox
  v-model:Value="spinValue"
  Header="${t('sample.numberbox.enter-integer')}"
  :SmallChange="10"
  :LargeChange="100"
  :SpinButtonPlacementMode="spinMode" />`);

const example3Template = computed(() => `<NumberBox
  v-model:Value="currencyValue"
  :NumberFormatter="currencyFormatter"
  Header="${t('sample.numberbox.enter-dollar-amount')}"
  PlaceholderText="0.00"
  :SmallChange="0.25"
  @ValueChanged="roundCurrency" />`);
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; }
.options-group, .stack-example { display: flex; flex-direction: column; gap: 8px; }
.options-label { color: var(--text-primary); font-size: 14px; font-weight: 600; }
.output-text { color: var(--text-primary); font-size: 14px; }
</style>
