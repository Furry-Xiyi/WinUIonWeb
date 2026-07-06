<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ItemsRepeater</h1>
      <p class="page-description">
        The ItemsRepeater is a light-weight control for displaying repeating data. It's highly customizable through flexible layout options and supports virtualizing layout. Use ItemsRepeater when you need more control over layout than what you get from a ListView or GridView.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Basic non-interactive items -->
    <WinControlExample
      headerText="Basic non-interactive items"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border-default); border-radius: 4px;">
          <WinItemsRepeater
            :itemsSource="barItems"
            layout="StackLayout"
            :orientation="example1Layout"
            :enableVirtualization="false">
            <template #default="{ item }">
              <div :style="{
                width: example1Layout === 'Vertical' ? `${item.maxLength}px` : '48px',
                height: example1Layout === 'Vertical' ? '24px' : `${item.maxHeight}px`,
                background: 'var(--control-fill-subtle-secondary)',
                marginBottom: example1Layout === 'Vertical' ? '8px' : '0',
                marginRight: example1Layout === 'Horizontal' ? '8px' : '0',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden'
              }">
                <div :style="{
                  width: example1Layout === 'Vertical' ? `${item.length}px` : '100%',
                  height: example1Layout === 'Vertical' ? '100%' : `${item.height}px`,
                  background: 'var(--accent-default)',
                  position: 'absolute',
                  left: '0',
                  top: example1Layout === 'Vertical' ? '0' : 'auto',
                  bottom: example1Layout === 'Horizontal' ? '0' : 'auto'
                }"></div>
              </div>
            </template>
          </WinItemsRepeater>
        </div>
      </template>
      <template #options>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinButton @click="addBarItem" style="min-width: 150px;">
            Add Item
          </WinButton>
          <WinButton @click="deleteBarItem" style="min-width: 150px;">
            Remove Item
          </WinButton>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
              Layout
            </div>
            <WinRadioButton
              v-model="example1LayoutOption"
              value="Vertical"
              name="layout1">
              StackLayout - Vertical
            </WinRadioButton>
            <WinRadioButton
              v-model="example1LayoutOption"
              value="Horizontal"
              name="layout1">
              StackLayout - Horizontal
            </WinRadioButton>
            <WinRadioButton
              v-model="example1LayoutOption"
              value="UniformGrid"
              name="layout1">
              UniformGridLayout
            </WinRadioButton>
          </div>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: Virtualizing scrollable list items -->
    <WinControlExample
      headerText="Virtualizing scrollable list items"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="height: 400px; overflow-y: auto; border: 1px solid var(--border-default); border-radius: 4px; padding: 8px;">
          <WinItemsRepeater
            v-if="example2LayoutType === 'UniformGrid'"
            :itemsSource="numberItems"
            layout="UniformGridLayout"
            :itemWidth="108"
            :itemHeight="108"
            :minimumItemSpacing="12"
            :enableVirtualization="true">
            <template #default="{ item, index }">
              <div :style="{
                width: '100%',
                height: '100%',
                background: index % 2 === 0 ? 'var(--control-fill-subtle-secondary)' : 'var(--accent-default)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: index % 2 === 0 ? 'var(--text-primary)' : 'white'
              }">
                {{ item }}
              </div>
            </template>
          </WinItemsRepeater>

          <WinItemsRepeater
            v-else
            :itemsSource="numberItems"
            layout="StackLayout"
            orientation="Vertical"
            :enableVirtualization="true">
            <template #default="{ item, index }">
              <div :style="{
                minHeight: '80px',
                background: index % 2 === 0 ? 'var(--control-fill-subtle-secondary)' : 'var(--accent-default)',
                borderRadius: '4px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: index % 2 === 0 ? 'var(--text-primary)' : 'white'
              }">
                {{ item }}
              </div>
            </template>
          </WinItemsRepeater>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <WinRadioButton
            v-model="example2LayoutType"
            value="UniformGrid"
            name="layout2">
            Uniform grid
          </WinRadioButton>
          <WinRadioButton
            v-model="example2LayoutType"
            value="Custom"
            name="layout2">
            Custom virtualizing layout
          </WinRadioButton>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: Mixed type collection -->
    <WinControlExample
      headerText="Mixed type collection"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="padding: 16px;">
          <p style="margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
            This is an ItemsRepeater that displays both integer and string items. It uses a DataTemplateSelector to choose the correct layout for each of its items.
          </p>
          <WinItemsRepeater
            :itemsSource="mixedItems"
            layout="UniformGridLayout"
            :itemWidth="200"
            :itemHeight="200"
            :minimumItemSpacing="12"
            :enableVirtualization="false">
            <template #default="{ item }">
              <div v-if="typeof item === 'string'" :style="{
                width: '100%',
                height: '100%',
                background: 'var(--accent-default)',
                borderRadius: '4px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                textAlign: 'center'
              }">
                {{ item }}
              </div>
              <div v-else :style="{
                width: '100%',
                height: '100%',
                background: 'var(--control-fill-subtle-secondary)',
                borderRadius: '4px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }">
                {{ item }}
              </div>
            </template>
          </WinItemsRepeater>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: Nested ItemsRepeaters -->
    <WinControlExample
      headerText="Laying out nested ItemsRepeaters"
      :theme="pageTheme"
      :templateCode="example4Template"
      :vueCode="example4Vue">
      <template #example>
        <div style="overflow-x: auto; border: 1px solid var(--border-default); border-radius: 4px; padding: 8px;">
          <WinItemsRepeater
            :itemsSource="categories"
            layout="StackLayout"
            orientation="Vertical"
            :enableVirtualization="false">
            <template #default="{ item }">
              <div style="margin-bottom: 16px;">
                <div style="font-size: 20px; font-weight: 600; padding: 8px; color: var(--text-primary);">
                  {{ item.categoryName }}
                </div>
                <WinItemsRepeater
                  :itemsSource="item.categoryItems"
                  layout="StackLayout"
                  orientation="Horizontal"
                  :enableVirtualization="false">
                  <template #default="{ item: subItem }">
                    <div :style="{
                      background: 'var(--accent-default)',
                      color: 'white',
                      padding: '10px',
                      marginRight: '10px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      textAlign: 'center',
                      minWidth: '80px'
                    }">
                      {{ subItem }}
                    </div>
                  </template>
                </WinItemsRepeater>
              </div>
            </template>
          </WinItemsRepeater>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinItemsRepeater from '../components/WinItemsRepeater.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'itemsrepeater');

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

// Example 1: Basic non-interactive items
const barItems = ref([
  { length: 100, maxLength: 300, height: 40, maxHeight: 100 },
  { length: 200, maxLength: 300, height: 60, maxHeight: 100 },
  { length: 150, maxLength: 300, height: 80, maxHeight: 100 },
  { length: 250, maxLength: 300, height: 50, maxHeight: 100 },
  { length: 180, maxLength: 300, height: 70, maxHeight: 100 }
]);

const example1LayoutOption = ref('Vertical');
const example1Layout = computed(() => {
  if (example1LayoutOption.value === 'UniformGrid') return 'UniformGrid';
  return example1LayoutOption.value;
});

const addBarItem = () => {
  const newLength = Math.floor(Math.random() * 250) + 50;
  const newHeight = Math.floor(Math.random() * 80) + 20;
  barItems.value.push({
    length: newLength,
    maxLength: 300,
    height: newHeight,
    maxHeight: 100
  });
};

const deleteBarItem = () => {
  if (barItems.value.length > 0) {
    barItems.value.pop();
  }
};

const example1Template = `<WinItemsRepeater
  :itemsSource="barItems"
  layout="StackLayout"
  orientation="Vertical">
  <template #default="{ item }">
    <div :style="{
      width: item.maxLength + 'px',
      height: '24px',
      background: 'var(--control-fill-subtle-secondary)',
      borderRadius: '2px',
      position: 'relative'
    }">
      <div :style="{
        width: item.length + 'px',
        height: '100%',
        background: 'var(--accent-default)'
      }"></div>
    </div>
  </template>
</WinItemsRepeater>`;

const example1Vue = `const barItems = ref([
  { length: 100, maxLength: 300 },
  { length: 200, maxLength: 300 },
  { length: 150, maxLength: 300 }
]);

const addBarItem = () => {
  const newLength = Math.floor(Math.random() * 250) + 50;
  barItems.value.push({
    length: newLength,
    maxLength: 300
  });
};`;

// Example 2: Virtualizing scrollable list
const numberItems = ref(Array.from({ length: 500 }, (_, i) => i + 1));
const example2LayoutType = ref('Custom');

const example2Template = `<WinItemsRepeater
  :itemsSource="numberItems"
  layout="UniformGridLayout"
  :itemWidth="108"
  :itemHeight="108"
  :minimumItemSpacing="12"
  :enableVirtualization="true">
  <template #default="{ item, index }">
    <div :style="{
      width: '100%',
      height: '100%',
      background: index % 2 === 0
        ? 'var(--control-fill-subtle-secondary)'
        : 'var(--accent-default)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }">
      {{ item }}
    </div>
  </template>
</WinItemsRepeater>`;

const example2Vue = `const numberItems = ref(
  Array.from({ length: 500 }, (_, i) => i + 1)
);`;

// Example 3: Mixed type collection
const mixedItems = ref([
  'Apple', 1, 'Banana', 2, 'Cherry', 3,
  'Date', 4, 'Elderberry', 5, 'Fig', 6
]);

const example3Template = `<WinItemsRepeater
  :itemsSource="mixedItems"
  layout="UniformGridLayout"
  :itemWidth="200"
  :itemHeight="200">
  <template #default="{ item }">
    <div v-if="typeof item === 'string'"
      class="string-item">
      {{ item }}
    </div>
    <div v-else class="number-item">
      {{ item }}
    </div>
  </template>
</WinItemsRepeater>`;

const example3Vue = `const mixedItems = ref([
  'Apple', 1, 'Banana', 2, 'Cherry', 3,
  'Date', 4, 'Elderberry', 5
]);`;

// Example 4: Nested ItemsRepeaters
const categories = ref([
  {
    categoryName: 'Fruits',
    categoryItems: ['Apple', 'Banana', 'Cherry', 'Date']
  },
  {
    categoryName: 'Vegetables',
    categoryItems: ['Carrot', 'Broccoli', 'Spinach', 'Lettuce']
  },
  {
    categoryName: 'Grains',
    categoryItems: ['Rice', 'Wheat', 'Oats', 'Barley']
  }
]);

const example4Template = `<WinItemsRepeater
  :itemsSource="categories"
  layout="StackLayout"
  orientation="Vertical">
  <template #default="{ item }">
    <div>
      <h3>{{ item.categoryName }}</h3>
      <WinItemsRepeater
        :itemsSource="item.categoryItems"
        layout="StackLayout"
        orientation="Horizontal">
        <template #default="{ item: subItem }">
          <div class="category-item">
            {{ subItem }}
          </div>
        </template>
      </WinItemsRepeater>
    </div>
  </template>
</WinItemsRepeater>`;

const example4Vue = `const categories = ref([
  {
    categoryName: 'Fruits',
    categoryItems: ['Apple', 'Banana', 'Cherry']
  },
  {
    categoryName: 'Vegetables',
    categoryItems: ['Carrot', 'Broccoli', 'Spinach']
  }
]);`;
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
</style>
