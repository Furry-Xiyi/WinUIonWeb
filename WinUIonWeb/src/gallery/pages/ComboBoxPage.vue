<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" :Text="$t('text.combobox')" />
      <WinTextBlock class="page-description" :Text="$t('text.use-a-combobox-also-known-as-a-drop-down-list-to')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" :Text="$t('sample.combobox.inline')" />

    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="comboBoxInlineVue">
      <template #example>
        <div class="vertical-stack">
          <WinComboBox v-model:SelectedIndex="Combo1" Width="200" :Header="$t('text.colors')" :PlaceholderText="$t('sample.combobox.pick-a-color')" :ItemsSource="colors" @SelectionChanged="ColorComboBox_SelectionChanged" />
          <div class="color-output" :style="{ backgroundColor: selectedColor }"></div>
        </div>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" :Text="$t('sample.combobox.itemssource')" />

    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="comboBoxItemsSourceVue">
      <template #example>
        <div class="vertical-stack">
          <WinComboBox v-model:SelectedIndex="Combo2" MinWidth="200" :Header="$t('sample.combobox.font')" :ItemsSource="fonts" />
          <WinTextBlock class="output-text" :FontFamily="fonts[Combo2]?.value" :Text="$t('sample.combobox.font-text')" />
        </div>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" :Text="$t('sample.combobox.editable')" />

    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="comboBoxEditableVue">
      <template #example>
        <div class="vertical-stack">
          <WinComboBox v-model:SelectedIndex="Combo3" Width="200" :Header="$t('sample.combobox.font-size')" IsEditable :ItemsSource="fontSizes" @TextSubmitted="Combo3_TextSubmitted" />
          <WinTextBlock class="output-text" FontFamily="Segoe UI" :FontSize="fontSizes[Combo3]?.value" :Text="$t('sample.combobox.font-size-text')" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'combobox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const colors = computed(() => [
  { label: t('text.blue'), value: 'Blue', color: '#0078D4' },
  { label: t('text.green'), value: 'Green', color: '#10893E' },
  { label: t('text.red'), value: 'Red', color: '#D13438' },
  { label: t('text.yellow'), value: 'Yellow', color: '#FFB900' }
]);
const fonts = computed(() => [
  { label: t('text.arial'), value: 'Arial' },
  { label: t('text.comic-sans-ms'), value: 'Comic Sans MS' },
  { label: t('text.courier-new'), value: 'Courier New' },
  { label: t('text.georgia'), value: 'Georgia' },
  { label: t('text.segoe-ui'), value: 'Segoe UI' },
  { label: t('text.times-new-roman'), value: 'Times New Roman' },
  { label: t('text.trebuchet-ms'), value: 'Trebuchet MS' },
  { label: t('text.verdana'), value: 'Verdana' }
]);
const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72].map((size) => ({ label: String(size), value: size }));

const Combo1 = ref(undefined);
const Combo2 = ref(2);
const Combo3 = ref(2);
const selectedColor = ref('transparent');

const ColorComboBox_SelectionChanged = ({ SelectedIndex }) => {
  selectedColor.value = colors.value[SelectedIndex]?.color ?? 'transparent';
};

const Combo3_TextSubmitted = ({ Text }) => {
  const value = Number(Text);
  if (!Number.isFinite(value)) return;
  const index = fontSizes.findIndex((item) => item.value === value);
  if (index >= 0) Combo3.value = index;
};

const comboBoxInlineVue = `<WinComboBox Width="200" Header="Colors" PlaceholderText="Pick a color" :ItemsSource="colors" @SelectionChanged="ColorComboBox_SelectionChanged" />`;
const comboBoxItemsSourceVue = `<WinComboBox MinWidth="200" Header="Font" SelectedIndex="2" :ItemsSource="fonts" />`;
const comboBoxEditableVue = `<WinComboBox Width="200" Header="Font Size" IsEditable :ItemsSource="fontSizes" @TextSubmitted="Combo3_TextSubmitted" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", "WinUIOnWebIcons"; font-size: 16px; }
.vertical-stack { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.color-output { width: 100px; height: 30px; border: 1px solid var(--ctrl-border); }
.output-text { margin-top: 4px; }
</style>
