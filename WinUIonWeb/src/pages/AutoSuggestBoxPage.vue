<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">AutoSuggestBox</h1>
      <p class="page-description">
        Use an AutoSuggestBox to provide a list of suggestions for a user to select from as they type.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Basic AutoSuggestBox -->
    <WinControlExample
      headerText="Basic AutoSuggestBox"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinAutoSuggestBox
            :text="basicText"
            @update:text="basicText = $event"
            :itemsSource="basicSuggestions"
            @textChanged="onBasicTextChanged"
            @suggestionChosen="onBasicSuggestionChosen"
            :width="300" />
          <span class="output-text">{{ basicOutput }}</span>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: AutoSuggestBox provides search experience -->
    <WinControlExample
      headerText="AutoSuggestBox provides a search experience"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <WinAutoSuggestBox
            :text="searchText"
            @update:text="searchText = $event"
            :itemsSource="searchSuggestions"
            placeholderText="Type a control name"
            queryIcon="&#xE721;"
            @textChanged="onSearchTextChanged"
            @suggestionChosen="onSearchSuggestionChosen"
            @querySubmitted="onSearchQuerySubmitted"
            :width="300" />

          <div v-if="selectedControl" class="control-details">
            <div class="control-info">
              <div class="control-title">{{ selectedControl.title }}</div>
              <div class="control-subtitle">{{ selectedControl.subtitle }}</div>
            </div>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinAutoSuggestBox from '../components/WinAutoSuggestBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'autosuggestbox');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// Cat breeds data (from official code)
const cats = [
  "Abyssinian", "Aegean", "American Bobtail", "American Curl", "American Ringtail",
  "American Shorthair", "American Wirehair", "Aphrodite Giant", "Arabian Mau",
  "Asian cat", "Asian Semi-longhair", "Australian Mist", "Balinese", "Bambino",
  "Bengal", "Birman", "Brazilian Shorthair", "British Longhair", "British Shorthair",
  "Burmese", "Burmilla", "California Spangled", "Chantilly-Tiffany", "Chartreux",
  "Chausie", "Colorpoint Shorthair", "Cornish Rex", "Cymric", "Cyprus", "Devon Rex",
  "Donskoy", "Dragon Li", "Dwelf", "Egyptian Mau", "European Shorthair",
  "Exotic Shorthair", "Foldex", "German Rex", "Havana Brown", "Highlander",
  "Himalayan", "Japanese Bobtail", "Javanese", "Kanaani", "Khao Manee",
  "Kinkalow", "Korat", "Korean Bobtail", "Korn Ja", "Kurilian Bobtail",
  "Lambkin", "LaPerm", "Lykoi", "Maine Coon", "Manx", "Mekong Bobtail",
  "Minskin", "Napoleon", "Munchkin", "Nebelung", "Norwegian Forest Cat",
  "Ocicat", "Ojos Azules", "Oregon Rex", "Persian (modern)", "Persian (traditional)",
  "Peterbald", "Pixie-bob", "Ragamuffin", "Ragdoll", "Raas", "Russian Blue",
  "Russian White", "Sam Sawet", "Savannah", "Scottish Fold", "Selkirk Rex",
  "Serengeti", "Serrade Petit", "Siamese", "Siberian or´Siberian Forest Cat",
  "Singapura", "Snowshoe", "Sokoke", "Somali", "Sphynx", "Suphalak",
  "Thai", "Thai Lilac", "Tonkinese", "Toyger", "Turkish Angora", "Turkish Van",
  "Turkish Vankedisi", "Ukrainian Levkoy", "Wila Krungthep", "York Chocolate"
];

// Control names data (simulated from WinUI Gallery)
const controls = [
  { title: "AnimatedIcon", subtitle: "An icon that plays an animation in response to user interaction and visual state changes." },
  { title: "AutoSuggestBox", subtitle: "A control to provide suggestions as a user is typing." },
  { title: "Button", subtitle: "A control that responds to user input and raises a Click event." },
  { title: "CheckBox", subtitle: "A control that a user can select or clear." },
  { title: "ComboBox", subtitle: "A drop-down list of items a user can select from." },
  { title: "HyperlinkButton", subtitle: "A button that appears as hyperlink text." },
  { title: "RadioButton", subtitle: "A control that allows a user to select a single option from a group of options." },
  { title: "Slider", subtitle: "A control that lets the user select from a range of values by moving a Thumb control along a track." },
  { title: "TextBox", subtitle: "A control that allows a user to type text." },
  { title: "ToggleButton", subtitle: "A button that can be switched between two states." },
  { title: "ToggleSwitch", subtitle: "A switch that can be toggled between two states." }
];

// Example 1: Basic AutoSuggestBox
const basicText = ref('');
const basicSuggestions = ref([]);
const basicOutput = ref('');

const onBasicTextChanged = (args) => {
  if (args.reason === 'UserInput') {
    const query = args.text.toLowerCase();
    const splitText = query.split(' ');

    const suitableItems = cats.filter(cat => {
      return splitText.every(key => cat.toLowerCase().includes(key));
    });

    if (suitableItems.length === 0) {
      basicSuggestions.value = ['No results found'];
    } else {
      basicSuggestions.value = suitableItems;
    }
  }
};

const onBasicSuggestionChosen = (args) => {
  basicOutput.value = args.selectedItem;
};

// Example 1 code
const example1Template = `<WinAutoSuggestBox
  :text="basicText"
  @update:text="basicText = $event"
  :itemsSource="basicSuggestions"
  @textChanged="onBasicTextChanged"
  @suggestionChosen="onBasicSuggestionChosen"
  :width="300" />`;

const example1Vue = `const basicText = ref('');
const basicSuggestions = ref([]);

const cats = ["Abyssinian", "Aegean", "American Bobtail", ...];

const onBasicTextChanged = (args) => {
  if (args.reason === 'UserInput') {
    const query = args.text.toLowerCase();
    const splitText = query.split(' ');

    const suitableItems = cats.filter(cat => {
      return splitText.every(key => cat.toLowerCase().includes(key));
    });

    basicSuggestions.value = suitableItems.length === 0
      ? ['No results found']
      : suitableItems;
  }
};

const onBasicSuggestionChosen = (args) => {
  console.log('Selected:', args.selectedItem);
};`;

// Example 2: Search experience
const searchText = ref('');
const searchSuggestions = ref([]);
const selectedControl = ref(null);

const onSearchTextChanged = (args) => {
  if (args.reason === 'UserInput') {
    const suggestions = searchControls(args.text);

    if (suggestions.length > 0) {
      searchSuggestions.value = suggestions;
    } else {
      searchSuggestions.value = [{ title: 'No results found', subtitle: '' }];
    }
  }
};

const onSearchSuggestionChosen = (args) => {
  if (args.selectedItem && args.selectedItem.title !== 'No results found') {
    searchText.value = args.selectedItem.title;
  }
};

const onSearchQuerySubmitted = (args) => {
  if (args.chosenSuggestion && args.chosenSuggestion.title !== 'No results found') {
    selectControl(args.chosenSuggestion);
  } else if (args.queryText) {
    const suggestions = searchControls(args.queryText);
    if (suggestions.length > 0) {
      selectControl(suggestions[0]);
    }
  }
};

const searchControls = (query) => {
  if (!query) return [];

  const querySplit = query.toLowerCase().split(' ');

  return controls.filter(control => {
    return querySplit.every(queryToken => {
      return control.title.toLowerCase().includes(queryToken);
    });
  }).sort((a, b) => {
    const aStarts = a.title.toLowerCase().startsWith(query.toLowerCase());
    const bStarts = b.title.toLowerCase().startsWith(query.toLowerCase());
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.title.localeCompare(b.title);
  });
};

const selectControl = (control) => {
  if (control && control.title !== 'No results found') {
    selectedControl.value = control;
  }
};

// Example 2 code
const example2Template = `<WinAutoSuggestBox
  :text="searchText"
  @update:text="searchText = $event"
  :itemsSource="searchSuggestions"
  placeholderText="Type a control name"
  queryIcon="&#xE721;"
  @textChanged="onSearchTextChanged"
  @suggestionChosen="onSearchSuggestionChosen"
  @querySubmitted="onSearchQuerySubmitted"
  :width="300" />`;

const example2Vue = `const searchText = ref('');
const searchSuggestions = ref([]);
const selectedControl = ref(null);

const controls = [
  { title: "Button", subtitle: "A control that responds to user input" },
  { title: "CheckBox", subtitle: "A control that a user can select or clear" },
  // ... more controls
];

const onSearchTextChanged = (args) => {
  if (args.reason === 'UserInput') {
    const suggestions = searchControls(args.text);
    searchSuggestions.value = suggestions.length > 0
      ? suggestions
      : [{ title: 'No results found', subtitle: '' }];
  }
};

const onSearchQuerySubmitted = (args) => {
  if (args.chosenSuggestion) {
    selectControl(args.chosenSuggestion);
  } else if (args.queryText) {
    const suggestions = searchControls(args.queryText);
    if (suggestions.length > 0) selectControl(suggestions[0]);
  }
};

const searchControls = (query) => {
  return controls.filter(control =>
    control.title.toLowerCase().includes(query.toLowerCase())
  );
};`;
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
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.control-details {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--card-background-secondary);
  border-radius: 6px;
  border: 1px solid var(--card-stroke-default);
}

.control-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.control-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>
