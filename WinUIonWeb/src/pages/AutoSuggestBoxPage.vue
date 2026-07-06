<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" Text="AutoSuggestBox" />
      <WinTextBlock
        class="page-description"
        Text="Use an AutoSuggestBox to provide a list of suggestions for a user to select from as they type." />
      <div class="page-header-actions">
        <WinButton @click="toggleTheme" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model="isFavoriteState" subtle @update:modelValue="toggleFavorite" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" Text="A basic AutoSuggestBox" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template">
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

    <WinTextBlock class="control-example-description" Text="AutoSuggestBox provides a search experience" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template">
      <template #example>
        <div class="search-example">
          <WinAutoSuggestBox
            v-model:Text="controlText"
            :ItemsSource="controlSuggestions"
            TextMemberPath="title"
            PlaceholderText="Type a control name"
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
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinAutoSuggestBox from '../components/WinAutoSuggestBox.vue';
import WinButton from '../components/WinButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'autosuggestbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const cats = ['Abyssinian', 'Aegean', 'American Bobtail', 'American Curl', 'American Shorthair', 'Bengal', 'Birman', 'British Shorthair', 'Burmese', 'Chartreux', 'Devon Rex', 'Egyptian Mau', 'Maine Coon', 'Persian', 'Ragdoll', 'Russian Blue', 'Siamese', 'Sphynx', 'Turkish Angora'];
const controls = [
  { title: 'AutoSuggestBox', subtitle: 'A text control that shows suggestions as users type.' },
  { title: 'Button', subtitle: 'A control that responds to user input and raises a Click event.' },
  { title: 'CheckBox', subtitle: 'A control that a user can select or clear.' },
  { title: 'ComboBox', subtitle: 'A drop-down list of items a user can select from.' },
  { title: 'NumberBox', subtitle: 'A control that can be used to display and edit numbers.' },
  { title: 'PasswordBox', subtitle: 'A control for entering passwords.' },
  { title: 'RichEditBox', subtitle: 'A control for entering and editing formatted text.' },
  { title: 'TextBox', subtitle: 'A control that lets a user enter simple text input.' }
];

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

const onCatTextChanged = ({ reason, text }) => {
  if (reason !== 'UserInput') return;
  const results = filterByTokens(cats, text);
  catSuggestions.value = results.length ? results : ['No results found'];
};

const onCatSuggestionChosen = ({ selectedItem }) => {
  chosenCat.value = selectedItem === 'No results found' ? '' : selectedItem;
};

const onControlTextChanged = ({ reason, text }) => {
  if (reason !== 'UserInput') return;
  const results = filterByTokens(controls, text, (item) => item.title);
  controlSuggestions.value = results.length ? results : [{ title: 'No results found', subtitle: '' }];
};

const onControlSuggestionChosen = ({ selectedItem }) => {
  if (selectedItem.title !== 'No results found') controlText.value = selectedItem.title;
};

const onControlQuerySubmitted = ({ queryText, chosenSuggestion }) => {
  if (chosenSuggestion?.title && chosenSuggestion.title !== 'No results found') {
    selectedControl.value = chosenSuggestion;
    return;
  }
  selectedControl.value = filterByTokens(controls, queryText, (item) => item.title)[0] ?? null;
};

const example1Template = `<WinAutoSuggestBox
  v-model:Text="catText"
  :ItemsSource="catSuggestions"
  :Width="300"
  @TextChanged="onCatTextChanged"
  @SuggestionChosen="onCatSuggestionChosen" />`;

const example2Template = `<WinAutoSuggestBox
  v-model:Text="controlText"
  :ItemsSource="controlSuggestions"
  TextMemberPath="title"
  PlaceholderText="Type a control name"
  QueryIcon="Find"
  :Width="300"
  @TextChanged="onControlTextChanged"
  @SuggestionChosen="onControlSuggestionChosen"
  @QuerySubmitted="onControlQuerySubmitted" />`;
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets'; }
.horizontal-example { display: flex; align-items: center; gap: 16px; }
.search-example { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.output-text { color: var(--text-primary); font-size: 14px; }
.control-details { display: flex; gap: 8px; align-items: center; max-width: 520px; }
.control-preview { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 4px; background: var(--card-bg-secondary); border: 1px solid var(--card-stroke); font-weight: 600; }
.control-title { color: var(--text-primary); font-size: 14px; font-weight: 600; }
.control-subtitle { color: var(--text-secondary); font-size: 13px; line-height: 18px; }
</style>
