<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.autosuggestbox')" />
          <WinTextBlock
            class="page-description"
            :Text="$t('text.use-an-autosuggestbox-to-provide-a-list-of-sugge')" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('text.a-basic-autosuggestbox')">
              <template #example>
                <div class="horizontal-example">
                  <WinAutoSuggestBox
                    v-model:Text="catText"
                    :ItemsSource="catSuggestions"
                    :Width="300"
                    @TextChanged="onCatTextChanged"
                    @SuggestionChosen="onCatSuggestionChosen" />
                  <WinTextBlock class="output-text" :Text="chosenCat" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.autosuggestbox.search-experience')">
              <template #example>
                <div class="search-example">
                  <WinAutoSuggestBox
                    v-model:Text="controlText"
                    :ItemsSource="controlSuggestions"
                    TextMemberPath="title"
                    :PlaceholderText="$t('sample.autosuggestbox.type-control-name')"
                    QueryIcon="Find"
                    :Width="300"
                    @TextChanged="onControlTextChanged"
                    @SuggestionChosen="onControlSuggestionChosen"
                    @QuerySubmitted="onControlQuerySubmitted" />

                  <div v-if="selectedControl" class="control-details">
                    <div class="control-preview">{{ selectedControl.title.slice(0, 1) }}</div>
                    <div>
                      <WinTextBlock class="control-title" :Text="selectedControl.title" />
                      <WinTextBlock class="control-subtitle" :Text="selectedControl.subtitle" TextWrapping="WrapWholeWords" />
                    </div>
                  </div>
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinAutoSuggestBox from '../../components/WinAutoSuggestBox.vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'autosuggestbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const cats = ['Abyssinian', 'Aegean', 'American Bobtail', 'American Curl', 'American Shorthair', 'Bengal', 'Birman', 'British Shorthair', 'Burmese', 'Chartreux', 'Devon Rex', 'Egyptian Mau', 'Maine Coon', 'Persian', 'Ragdoll', 'Russian Blue', 'Siamese', 'Sphynx', 'Turkish Angora'];
const noResultsText = computed(() => t('sample.autosuggestbox.no-results'));
const controls = computed(() => [
  { title: 'AutoSuggestBox', subtitle: t('sample.autosuggestbox.subtitle.autosuggestbox') },
  { title: 'Button', subtitle: t('sample.autosuggestbox.subtitle.button') },
  { title: 'CheckBox', subtitle: t('sample.autosuggestbox.subtitle.checkbox') },
  { title: 'ComboBox', subtitle: t('sample.autosuggestbox.subtitle.combobox') },
  { title: 'NumberBox', subtitle: t('sample.autosuggestbox.subtitle.numberbox') },
  { title: 'PasswordBox', subtitle: t('sample.autosuggestbox.subtitle.passwordbox') },
  { title: 'RichEditBox', subtitle: t('sample.autosuggestbox.subtitle.richeditbox') },
  { title: 'TextBox', subtitle: t('sample.autosuggestbox.subtitle.textbox') }
]);

const catText = ref('');
const catSuggestions = ref([]);
const chosenCat = ref('');
const controlText = ref('');
const controlSuggestions = ref([]);
const selectedControl = ref(null);

const filterByTokens = (items, text, selector = (item) => item) => {
  const tokens = text.toLowerCase().split(' ').filter(Boolean);
  if (!tokens.length) return [];
  return items.filter((item) => tokens.every((token) => selector(item).toLowerCase().includes(token)));
};

const onCatTextChanged = ({ Reason }) => {
  if (Reason !== 'UserInput') return;
  const results = filterByTokens(cats, catText.value);
  catSuggestions.value = results.length ? results : [noResultsText.value];
};

const onCatSuggestionChosen = ({ SelectedItem }) => {
  chosenCat.value = SelectedItem === noResultsText.value ? '' : SelectedItem;
};

const onControlTextChanged = ({ Reason }) => {
  if (Reason !== 'UserInput') return;
  const results = filterByTokens(controls.value, controlText.value, (item) => item.title);
  controlSuggestions.value = results.length ? results : [{ title: noResultsText.value, subtitle: '' }];
};

const onControlSuggestionChosen = ({ SelectedItem }) => {
  if (SelectedItem.title !== noResultsText.value) controlText.value = SelectedItem.title;
};

const onControlQuerySubmitted = ({ QueryText, ChosenSuggestion }) => {
  if (ChosenSuggestion?.title && ChosenSuggestion.title !== noResultsText.value) {
    selectedControl.value = ChosenSuggestion;
    return;
  }
  selectedControl.value = filterByTokens(controls.value, QueryText, (item) => item.title)[0] ?? null;
};

const example1Template = `<WinAutoSuggestBox
  v-model:Text="catText"
  :ItemsSource="catSuggestions"
  :Width="300"
  @TextChanged="onCatTextChanged"
  @SuggestionChosen="onCatSuggestionChosen" />`;

const example2Template = computed(() => `<WinAutoSuggestBox
  v-model:Text="controlText"
  :ItemsSource="controlSuggestions"
  TextMemberPath="title"
  PlaceholderText="${t('sample.autosuggestbox.type-control-name')}"
  QueryIcon="Find"
  :Width="300"
  @TextChanged="onControlTextChanged"
  @SuggestionChosen="onControlSuggestionChosen"
  @QuerySubmitted="onControlQuerySubmitted" />`);
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; }
.horizontal-example { display: flex; align-items: center; gap: 16px; }
.search-example { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.output-text { color: var(--text-primary); font-size: 14px; }
.control-details { display: flex; gap: 8px; align-items: center; max-width: 520px; }
.control-preview { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 4px; background: var(--card-bg-secondary); border: 1px solid var(--card-stroke); font-weight: 600; }
.control-title { color: var(--text-primary); font-size: 14px; font-weight: 600; }
.control-subtitle { color: var(--text-secondary); font-size: 13px; line-height: 18px; }
</style>
