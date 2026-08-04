<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.itemsrepeater')" />
          <WinTextBlock class="page-description" :Text="$t('text.itemsrepeater-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsrepeater.basic-non-interactive')" :theme="pageTheme" :vue="basicRepeaterVue">
              <template #example>
                <WinScrollViewer class="scroll-host max-500" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto">
                  <WinItemsRepeater :ItemsSource="barItems" :Layout="basicLayout" :MaxWidth="basicRepeaterMaxWidth">
                    <template #default="{ item }">
                      <div v-if="basicLayoutKey === 'UniformGridLayout'" class="circle-template" :style="{ width: item.MaxDiameter + 'px', height: item.MaxDiameter + 'px' }">
                        <div class="circle-accent" :style="{ width: item.Diameter + 'px', height: item.Diameter + 'px' }"></div>
                      </div>
                      <div v-else-if="basicLayoutKey === 'HorizontalStackLayout'" class="vertical-bar-template" :style="{ height: item.MaxHeight + 'px' }">
                        <div class="bar-accent vertical" :style="{ height: item.Height + 'px' }"></div>
                      </div>
                      <div v-else class="horizontal-bar-template" :style="{ width: item.MaxLength + 'px' }">
                        <div class="bar-accent horizontal" :style="{ width: item.Length + 'px' }"></div>
                      </div>
                    </template>
                  </WinItemsRepeater>
                </WinScrollViewer>
              </template>
              <template #options>
                <div class="options-stack">
                  <WinButton class="option-button" @click="AddBtn_Click"><WinTextBlock :Text="$t('sample.add-item')" /></WinButton>
                  <WinButton class="option-button" @click="DeleteBtn_Click"><WinTextBlock :Text="$t('sample.remove-item')" /></WinButton>
                  <WinRadioButtons :Header="$t('sample.layout')" :ItemsSource="basicLayoutOptions" :SelectedIndex="basicLayoutSelectedIndex" @SelectionChanged="RadioBtn_Click" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" horizontalContentAlignment="Stretch" :headerText="$t('sample.itemsrepeater.virtualizing-scrollable-list-items')" :theme="pageTheme" :vue="virtualizingRepeaterVue">
              <template #example>
                <WinScrollViewer class="scroll-host feed-host" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
                  <WinItemsRepeater Margin="0,0,12,0" :ItemsSource="numbers" :Layout="virtualizingLayout" HorizontalAlignment="Stretch">
                    <template #default="{ item, index }">
                      <div class="number-card" :class="{ accent: index % 2 === 1 }">
                        <WinTextBlock :Text="String(item)" />
                      </div>
                    </template>
                  </WinItemsRepeater>
                </WinScrollViewer>
              </template>
              <template #options>
                <div class="options-stack">
                  <WinRadioButtons :ItemsSource="virtualizingLayoutOptions" :SelectedIndex="virtualizingLayoutSelectedIndex" @SelectionChanged="LayoutBtn_SelectionChanged" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsrepeater.mixed-type-collection')" :theme="pageTheme" :vue="mixedRepeaterVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="$t('sample.itemsrepeater.mixed-note')" TextWrapping="WrapWholeWords" />
                  <WinItemsRepeater Margin="0,0,12,0" :ItemsSource="mixedItems" :Layout="mixedLayout" HorizontalAlignment="Stretch">
                    <template #default="{ item }">
                      <div v-if="typeof item === 'string'" class="mixed-card string-card">
                        <WinTextBlock class="inverse-text mixed-string-text" :Text="String(item)" TextWrapping="WrapWholeWords" />
                      </div>
                      <div v-else class="mixed-card number-mixed-card">
                        <WinTextBlock class="mixed-number" :Text="String(item)" />
                      </div>
                    </template>
                  </WinItemsRepeater>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsrepeater.nested')" :theme="pageTheme" :vue="nestedRepeaterVue">
              <template #example>
                <WinScrollViewer class="scroll-host nested-scroll" VerticalScrollMode="Disabled" VerticalScrollBarVisibility="Disabled" HorizontalScrollMode="Auto" HorizontalScrollBarVisibility="Auto">
                  <WinItemsRepeater :ItemsSource="categories" :Layout="{ Type: 'StackLayout', Orientation: 'Vertical' }">
                    <template #default="{ item }">
                      <div class="category-block">
                        <WinTextBlock class="category-title" :Text="item.CategoryName" />
                        <WinItemsRepeater :ItemsSource="item.CategoryItems" :Layout="{ Type: 'StackLayout', Orientation: 'Horizontal', Spacing: 8 }">
                          <template #default="{ item: child }">
                            <div class="nested-pill">
                              <WinTextBlock class="inverse-text" :Text="String(child)" />
                            </div>
                          </template>
                        </WinItemsRepeater>
                      </div>
                    </template>
                  </WinItemsRepeater>
                </WinScrollViewer>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsrepeater.animated-scrolling-content-display')" :theme="pageTheme" :vue="animatedRepeaterVue">
              <template #example>
                <div class="animated-grid">
                  <WinScrollViewer class="scroll-host animated-list" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled" @ViewChanged="Animated_ScrollViewer_ViewChanging">
                    <WinItemsRepeater :ItemsSource="colors" :Layout="{ Type: 'StackLayout', Orientation: 'Vertical' }" @GettingFocus="OnAnimatedScrollRepeaterGettingFocus" @KeyDown="OnAnimatedScrollRepeaterKeyDown">
                      <template #default="{ item, index }">
                        <WinButton class="color-button" :style="getAnimatedButtonStyle(item, index)" @focus="OnAnimatedItemClicked(item, $event)" @Click="OnAnimatedItemClicked(item, $event)">
                          <WinTextBlock :Text="item" />
                        </WinButton>
                      </template>
                    </WinItemsRepeater>
                  </WinScrollViewer>
                  <div class="color-rectangle" :style="{ background: selectedColor }">
                    <WinTextBlock class="inverse-text" :Text="selectedColor" />
                  </div>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsrepeater.virtualized-content-heavy-layout')" :theme="pageTheme" :vue="contentHeavyRepeaterVue">
              <template #example>
                <div class="recipe-grid">
                  <WinScrollViewer class="scroll-host recipe-host" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
                    <WinItemsRepeater :ItemsSource="visibleRecipes" :Layout="recipeLayout">
                      <template #default="{ item }">
                        <div class="recipe-card">
                          <div class="recipe-color" :style="{ background: item.Color }">
                            <WinTextBlock class="recipe-number" :Text="String(item.Num)" />
                          </div>
                          <WinTextBlock class="recipe-name" :Text="item.Name" TextWrapping="WrapWholeWords" />
                          <WinTextBlock class="recipe-ingredients" :Text="item.Ingredients" TextWrapping="WrapWholeWords" />
                        </div>
                      </template>
                    </WinItemsRepeater>
                  </WinScrollViewer>
                  <div class="recipe-options">
                    <WinTextBox v-model:Text="recipeFilter" Width="200" :Header="$t('sample.filter-by-ingredient')" />
                    <WinTextBlock Margin="0,0,0,10" :Text="$t('sample.sort-by-number-of-ingredients')" />
                    <WinButton class="option-button" @click="OnSortAscClick"><WinTextBlock :Text="$t('sample.least-to-most')" /></WinButton>
                    <WinButton class="option-button" @click="OnSortDesClick"><WinTextBlock :Text="$t('sample.most-to-least')" /></WinButton>
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
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinItemsRepeater from '../../components/WinItemsRepeater.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinTextBox from '../../components/WinTextBox.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';
import { useI18n } from '../../components/i18n/index';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'itemsrepeater');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const maxLength = 425;
const makeBar = (length = randomBetween(0, maxLength - 1)) => ({
  Length: length,
  MaxLength: maxLength,
  Height: length / 4,
  MaxHeight: maxLength / 4,
  Diameter: length / 6,
  MaxDiameter: maxLength / 6
});

const barItems = ref([makeBar(300), makeBar(25), makeBar(175)]);
const basicLayoutOptions = computed(() => [
  { Text: t('sample.stacklayout-vertical'), Value: 'VerticalStackLayout' },
  { Text: t('sample.stacklayout-horizontal'), Value: 'HorizontalStackLayout' },
  { Text: 'UniformGridLayout', Value: 'UniformGridLayout' }
]);
const basicLayoutSelectedIndex = ref(0);
const basicLayoutKey = computed(() => ['VerticalStackLayout', 'HorizontalStackLayout', 'UniformGridLayout'][basicLayoutSelectedIndex.value]);
const basicLayout = computed(() => {
  if (basicLayoutKey.value === 'HorizontalStackLayout') return { Type: 'StackLayout', Orientation: 'Horizontal', Spacing: 8 };
  if (basicLayoutKey.value === 'UniformGridLayout') return { Type: 'UniformGridLayout', MinItemWidth: 100, MinItemHeight: 100, MinColumnSpacing: 8, MinRowSpacing: 8 };
  return { Type: 'StackLayout', Orientation: 'Vertical', Spacing: 8 };
});
const basicRepeaterMaxWidth = computed(() => {
  if (basicLayoutKey.value === 'HorizontalStackLayout') return 6000;
  if (basicLayoutKey.value === 'UniformGridLayout') return 540;
  return maxLength + 12;
});
const AddBtn_Click = () => barItems.value.push(makeBar());
const DeleteBtn_Click = () => { if (barItems.value.length) barItems.value.shift(); };
const RadioBtn_Click = ({ SelectedIndex }) => { basicLayoutSelectedIndex.value = SelectedIndex; };

const numbers = Array.from({ length: 500 }, (_, index) => index);
const virtualizingLayoutOptions = computed(() => [
  { Text: t('sample.uniform-grid'), Value: 'UniformGridLayout2' },
  { Text: t('sample.custom-virtualizing-layout'), Value: 'MyFeedLayout' }
]);
const virtualizingLayoutSelectedIndex = ref(1);
const virtualizingLayout = computed(() => virtualizingLayoutSelectedIndex.value === 0
  ? { Type: 'UniformGridLayout', MinItemWidth: 108, MinItemHeight: 108, MinColumnSpacing: 12, MinRowSpacing: 12 }
  : { Type: 'ActivityFeedLayout', MinItemWidth: 80, MinItemHeight: 108, ColumnSpacing: 12, RowSpacing: 12 });
const LayoutBtn_SelectionChanged = ({ SelectedIndex }) => { virtualizingLayoutSelectedIndex.value = SelectedIndex; };

const mixedItems = [
  64,
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  128,
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  256,
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  512,
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  1024
];
const mixedLayout = { Type: 'UniformGridLayout', MinItemWidth: 200, MinItemHeight: 200 };

const categories = [
  { CategoryName: 'Fruits', CategoryItems: ['Apricots', 'Bananas', 'Grapes', 'Strawberries', 'Watermelon', 'Plums', 'Blueberries'] },
  { CategoryName: 'Vegetables', CategoryItems: ['Broccoli', 'Spinach', 'Sweet potato', 'Cauliflower', 'Onion', 'Brussels sprouts', 'Carrots'] },
  { CategoryName: 'Grains', CategoryItems: ['Rice', 'Quinoa', 'Pasta', 'Bread', 'Farro', 'Oats', 'Barley'] },
  { CategoryName: 'Proteins', CategoryItems: ['Steak', 'Chicken', 'Tofu', 'Salmon', 'Pork', 'Chickpeas', 'Eggs'] }
];

const colors = ['Blue', 'BlueViolet', 'Crimson', 'DarkCyan', 'DarkGoldenrod', 'DarkMagenta', 'DarkOliveGreen', 'DarkRed', 'DarkSlateBlue', 'DeepPink', 'IndianRed', 'MediumSlateBlue', 'Maroon', 'MidnightBlue', 'Peru', 'SaddleBrown', 'SteelBlue', 'OrangeRed', 'Firebrick', 'DarkKhaki'];
const selectedColor = ref('Blue');
const animatedScrollTop = ref(0);
const animatedViewportHeight = 175;
const animatedButtonHeight = 32;

const getAnimatedScale = (index) => {
  const viewportCenter = animatedScrollTop.value + animatedViewportHeight / 2;
  const itemCenter = index * animatedButtonHeight + animatedButtonHeight / 2;
  const scale = 1 - Math.abs(viewportCenter - itemCenter) * (0.25 / (animatedViewportHeight / 2));
  return Math.max(0.75, Math.min(1, scale));
};

const getAnimatedButtonStyle = (color, index) => ({
  background: color,
  transform: `scale(${getAnimatedScale(index)})`,
  transformOrigin: 'center',
  transition: 'transform 80ms linear'
});

const OnAnimatedItemClicked = (color, event) => {
  selectedColor.value = color;
  event?.currentTarget?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
};
const Animated_ScrollViewer_ViewChanging = (args) => {
  animatedScrollTop.value = args?.verticalOffset ?? 0;
  const centerY = animatedScrollTop.value + animatedViewportHeight / 2;
  const closestIndex = Math.max(0, Math.min(colors.length - 1, Math.round((centerY - animatedButtonHeight / 2) / animatedButtonHeight)));
  selectedColor.value = colors[closestIndex] ?? selectedColor.value;
};
const OnAnimatedScrollRepeaterGettingFocus = () => {};
const OnAnimatedScrollRepeaterKeyDown = () => {};

const fruits = ['Apricots', 'Bananas', 'Grapes', 'Strawberries', 'Watermelon', 'Plums', 'Blueberries'];
const vegetables = ['Broccoli', 'Spinach', 'Sweet potato', 'Cauliflower', 'Onion', 'Brussels sprouts', 'Carrots'];
const grains = ['Rice', 'Quinoa', 'Pasta', 'Bread', 'Farro', 'Oats', 'Barley'];
const proteins = ['Steak', 'Chicken', 'Tofu', 'Salmon', 'Pork', 'Chickpeas', 'Eggs'];
const extras = ['Garlic', 'Lemon', 'Butter', 'Lime', 'Feta Cheese', 'Parmesan Cheese', 'Breadcrumbs'];
const recipeColors = colors;

const recipes = ref(Array.from({ length: 1000 }, (_, index) => {
  const ingredients = [
    fruits[index % 7],
    vegetables[(index * 3) % 7],
    grains[(index * 5) % 7],
    proteins[(index * 2) % 7]
  ];
  const extraCount = index % 4;
  for (let i = 0; i < extraCount; i++) {
    const ingredient = extras[(index + i * 2) % extras.length];
    if (!ingredients.includes(ingredient)) ingredients.push(ingredient);
  }
  return {
    Num: index,
    Name: `Recipe ${index}`,
    Ingredients: `\n${ingredients.join('\n')}`,
    IngList: ingredients,
    Color: recipeColors[index % recipeColors.length]
  };
}));
const recipeFilter = ref('');
const sortDirection = ref('asc');
const recipeLayout = { Type: 'VariedImageSizeLayout', MinItemWidth: 200, ColumnSpacing: 12, RowSpacing: 12 };
const visibleRecipes = computed(() => {
  const filter = recipeFilter.value.trim().toLowerCase();
  const filtered = filter
    ? recipes.value.filter((recipe) => recipe.Ingredients.toLowerCase().includes(filter))
    : [...recipes.value];
  return filtered.sort((left, right) => {
    const diff = left.IngList.length - right.IngList.length;
    return sortDirection.value === 'asc' ? diff : -diff;
  });
});
const OnSortAscClick = () => { sortDirection.value = 'asc'; };
const OnSortDesClick = () => { sortDirection.value = 'desc'; };

const basicRepeaterVue = `<WinItemsRepeater :ItemsSource="barItems" :Layout="{ Type: 'StackLayout', Orientation: 'Vertical', Spacing: 8 }">
  <template #default="{ item }">
    <div class="horizontal-bar-template">
      <div :style="{ width: item.Length + 'px' }"></div>
    </div>
  </template>
</WinItemsRepeater>`;

const virtualizingRepeaterVue = `<WinItemsRepeater :ItemsSource="numbers" :Layout="{ Type: 'ActivityFeedLayout', ColumnSpacing: 12, RowSpacing: 12 }">
  <template #default="{ item }">
    <div class="number-card">{{ item }}</div>
  </template>
</WinItemsRepeater>`;

const mixedRepeaterVue = `<WinItemsRepeater :ItemsSource="mixedItems" :Layout="{ Type: 'UniformGridLayout', MinItemWidth: 200, MinItemHeight: 200 }">
  <template #default="{ item }">
    <div v-if="typeof item === 'string'" class="string-card">{{ item }}</div>
    <div v-else class="number-mixed-card">{{ item }}</div>
  </template>
</WinItemsRepeater>`;

const nestedRepeaterVue = `<WinItemsRepeater :ItemsSource="categories" :Layout="{ Type: 'StackLayout', Orientation: 'Vertical' }">
  <template #default="{ item }">
    <WinTextBlock :Text="item.CategoryName" />
    <WinItemsRepeater :ItemsSource="item.CategoryItems" :Layout="{ Type: 'StackLayout', Orientation: 'Horizontal' }" />
  </template>
</WinItemsRepeater>`;

const animatedRepeaterVue = `<WinItemsRepeater :ItemsSource="colors" @GettingFocus="OnAnimatedScrollRepeaterGettingFocus" @KeyDown="OnAnimatedScrollRepeaterKeyDown">
  <template #default="{ item }">
    <WinButton :style="{ background: item }" @focus="OnAnimatedItemClicked(item)" @Click="OnAnimatedItemClicked(item)">
      <WinTextBlock :Text="item" />
    </WinButton>
  </template>
</WinItemsRepeater>`;

const contentHeavyRepeaterVue = `<WinItemsRepeater :ItemsSource="visibleRecipes" :Layout="{ Type: 'VariedImageSizeLayout', MinItemWidth: 200 }">
  <template #default="{ item }">
    <div class="recipe-card">
      <WinTextBlock :Text="item.Name" />
      <WinTextBlock :Text="item.Ingredients" />
    </div>
  </template>
</WinItemsRepeater>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; }
.sample-stack { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.scroll-host { max-width: 100%; }
.max-500 { max-height: 500px; }
.horizontal-bar-template { height: 24px; background: var(--ctrl-fill-secondary); overflow: hidden; }
.vertical-bar-template { width: 48px; background: var(--ctrl-fill-secondary); position: relative; }
.bar-accent { background: var(--accent-base); }
.bar-accent.horizontal { height: 24px; }
.bar-accent.vertical { width: 48px; position: absolute; top: 0; left: 0; }
.circle-template { display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--ctrl-fill-secondary); }
.circle-accent { border-radius: 50%; background: var(--accent-base); }
.options-stack { display: flex; flex-direction: column; gap: 12px; min-width: 220px; }
.option-button { min-width: 150px; align-self: flex-start; }
.feed-host { width: 100%; height: 400px; padding: 0 16px 0 0; box-sizing: border-box; }
.number-card { width: 100%; height: 100%; min-height: 108px; display: flex; align-items: center; justify-content: center; background: var(--ctrl-fill-secondary); color: var(--text-primary); font-weight: 600; box-sizing: border-box; }
.number-card.accent { background: var(--accent-base); color: var(--accent-text); }
.mixed-card { min-height: 200px; margin: 10px; padding: 10px; display: flex; align-items: center; justify-content: center; box-sizing: border-box; text-align: center; }
.string-card { background: var(--accent-base); color: var(--accent-text); }
.number-mixed-card { background: var(--ctrl-fill-secondary); }
.mixed-number { font-size: 32px; font-weight: 600; }
.mixed-string-text { padding: 10px; text-align: center; }
.category-block { margin-bottom: 16px; min-width: max-content; }
.category-title { padding: 8px; font-size: 20px; font-weight: 600; }
.nested-pill { min-width: 80px; padding: 10px; background: var(--accent-base); color: var(--accent-text); text-align: center; }
.animated-grid { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
.animated-list { width: 250px; height: 175px; }
.color-button { width: 100%; min-width: 0; justify-content: stretch; will-change: transform; }
.color-rectangle { width: 150px; height: 150px; margin: 0 0 0 10px; border: 1px solid var(--text-primary); display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
.recipe-grid { width: 100%; height: 600px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.recipe-host { height: 600px; }
.recipe-options { margin: 0 0 0 10px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.recipe-card { width: 190px; margin: 5px; background: var(--ctrl-fill-secondary); border: 1px solid var(--card-stroke); break-inside: avoid; }
.recipe-color { height: 75px; margin: 8px; opacity: .9; display: flex; align-items: center; justify-content: center; }
.recipe-number { color: white; font-size: 35px; text-align: center; }
.recipe-name { margin: 0 10px 0 15px; font-size: 20px; font-weight: 600; }
.recipe-ingredients { margin: 0 15px 15px; color: var(--text-secondary); white-space: pre-line; }
.inverse-text { color: white; }
@media (max-width: 739px) {
  .animated-grid,
  .recipe-grid { grid-template-columns: 1fr; }
}
</style>
