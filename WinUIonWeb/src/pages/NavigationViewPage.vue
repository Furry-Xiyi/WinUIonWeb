<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">NavigationView</h1>
      <p class="page-description">
        The NavigationView control provides top-level navigation for your app. It adapts to a variety of screen sizes and supports both top and left navigation styles.
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

    <!-- Example 1: Left Navigation (Default) -->
    <WinControlExample
      headerText="Default left navigation"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div class="nav-example-container">
          <WinNavigationView
            :selectedValue="leftSelectedValue"
            @update:selectedValue="leftSelectedValue = $event"
            :menuItems="leftMenuItems"
            header="This is Header Text"
            :isPaneOpen="leftPaneOpen"
            @update:isPaneOpen="leftPaneOpen = $event"
            paneDisplayMode="Left"
            style="height: 460px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px;">
            <div style="padding: 24px; color: var(--text-primary);">
              <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">{{ leftContentTitle }}</p>
              <p style="margin: 0; color: var(--text-secondary);">This is the content area for {{ leftSelectedValue }}.</p>
            </div>
          </WinNavigationView>
        </div>
      </template>
      <template #options>
        <p class="output-text">Selected: {{ leftSelectedValue }}</p>
        <p class="output-text">Pane Open: {{ leftPaneOpen }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: Top Navigation -->
    <WinControlExample
      headerText="Top navigation"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div class="nav-example-container">
          <WinNavigationView
            :selectedValue="topSelectedValue"
            @update:selectedValue="topSelectedValue = $event"
            :menuItems="topMenuItems"
            header="This is Header Text"
            paneDisplayMode="Top"
            style="height: 460px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px;">
            <div style="padding: 24px; color: var(--text-primary);">
              <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">{{ topContentTitle }}</p>
              <p style="margin: 0; color: var(--text-secondary);">This is the content area for {{ topSelectedValue }}.</p>
            </div>
          </WinNavigationView>
        </div>

        <p class="output-text">Selected: {{ topSelectedValue }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: Hierarchical Navigation -->
    <WinControlExample
      headerText="Hierarchical navigation"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div class="nav-example-container">
          <WinNavigationView
            :selectedValue="hierarchicalSelectedValue"
            @update:selectedValue="hierarchicalSelectedValue = $event"
            :menuItems="hierarchicalMenuItems"
            header="Hierarchical Menu"
            paneDisplayMode="Left"
            style="height: 460px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px;">
            <div style="padding: 24px; color: var(--text-primary);">
              <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">{{ hierarchicalContentTitle }}</p>
              <p style="margin: 0; color: var(--text-secondary);">This is the content area for {{ hierarchicalSelectedValue }}.</p>
            </div>
          </WinNavigationView>
        </div>

        <p class="output-text">Selected: {{ hierarchicalSelectedValue }}</p>
      </template>
    </WinControlExample>

    <!-- Example 4: Footer Menu Items -->
    <WinControlExample
      headerText="Footer menu items"
      :theme="pageTheme"
      :templateCode="example4Template"
      :vueCode="example4Vue">
      <template #example>
        <div class="nav-example-container">
          <WinNavigationView
            :selectedValue="footerSelectedValue"
            @update:selectedValue="footerSelectedValue = $event"
            :menuItems="footerMenuItems"
            :footerItems="footerBottomItems"
            header="This is Header Text"
            :paneDisplayMode="footerPaneMode"
            style="height: 460px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px;">
            <div style="padding: 24px; color: var(--text-primary);">
              <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">{{ footerContentTitle }}</p>
              <p style="margin: 0; color: var(--text-secondary);">This is the content area for {{ footerSelectedValue }}.</p>
            </div>
          </WinNavigationView>
        </div>

        <p class="output-text">Selected: {{ footerSelectedValue }}</p>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <p style="margin: 0; font-weight: 600; color: var(--text-primary);">Pane position:</p>
          <WinRadioButton
            :modelValue="footerPaneMode === 'Left'"
            @update:modelValue="footerPaneMode = 'Left'"
            name="footerPaneMode">
            Left mode
          </WinRadioButton>
          <WinRadioButton
            :modelValue="footerPaneMode === 'Top'"
            @update:modelValue="footerPaneMode = 'Top'"
            name="footerPaneMode">
            Top mode
          </WinRadioButton>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 5: API Control -->
    <WinControlExample
      headerText="NavigationView API"
      :theme="pageTheme"
      :templateCode="example5Template"
      :vueCode="example5Vue">
      <template #example>
        <div class="nav-example-container">
          <WinNavigationView
            :selectedValue="apiSelectedValue"
            @update:selectedValue="apiSelectedValue = $event"
            :menuItems="apiMenuItems"
            :header="apiHeader"
            :paneTitle="apiPaneTitle"
            :isSettingsVisible="apiSettingsVisible"
            :isBackButtonVisible="apiBackVisible ? 'visible' : 'collapsed'"
            :paneDisplayMode="apiPaneMode"
            style="height: 540px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px;">
            <div style="padding: 24px; color: var(--text-primary);">
              <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">{{ apiContentTitle }}</p>
              <p style="margin: 0; color: var(--text-secondary);">This is the content area for {{ apiSelectedValue }}.</p>
            </div>
          </WinNavigationView>
        </div>

        <p class="output-text">Selected: {{ apiSelectedValue }}</p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <WinCheckBox v-model="apiSettingsVisible">
            Settings item visible
          </WinCheckBox>
          <WinCheckBox v-model="apiBackVisible">
            Back button visible
          </WinCheckBox>

          <div style="margin-top: 8px;">
            <label style="display: block; margin-bottom: 4px; color: var(--text-primary); font-size: 14px;">Header:</label>
            <input
              type="text"
              v-model="apiHeader"
              style="width: 100%; padding: 6px 8px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px; background: var(--ctrl-bg-default); color: var(--text-primary);" />
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; color: var(--text-primary); font-size: 14px;">PaneTitle:</label>
            <input
              type="text"
              v-model="apiPaneTitle"
              style="width: 100%; padding: 6px 8px; border: 1px solid var(--ctrl-border-rest); border-radius: 4px; background: var(--ctrl-bg-default); color: var(--text-primary);" />
          </div>

          <div style="margin-top: 8px;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: var(--text-primary);">PanePosition:</p>
            <WinRadioButton
              :modelValue="apiPaneMode === 'Left'"
              @update:modelValue="apiPaneMode = 'Left'"
              name="apiPaneMode">
              Left
            </WinRadioButton>
            <WinRadioButton
              :modelValue="apiPaneMode === 'Top'"
              @update:modelValue="apiPaneMode = 'Top'"
              name="apiPaneMode">
              Top
            </WinRadioButton>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinNavigationView from '../components/WinNavigationView.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'navigationview');

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

// Example 1: Left Navigation
const leftSelectedValue = ref('item1');
const leftPaneOpen = ref(true);
const leftMenuItems = [
  { value: 'item1', label: 'Menu Item1', icon: '' },
  { value: 'item2', label: 'Menu Item2', icon: '' },
  { value: 'item3', label: 'Menu Item3', icon: '' },
  { value: 'item4', label: 'Menu Item4', icon: '' }
];

const leftContentTitle = computed(() => {
  const item = leftMenuItems.find(i => i.value === leftSelectedValue.value);
  return item ? item.label : 'Content';
});

const example1Template = `<WinNavigationView
  :selectedValue="leftSelectedValue"
  @update:selectedValue="leftSelectedValue = $event"
  :menuItems="leftMenuItems"
  header="This is Header Text"
  paneDisplayMode="Left"
  style="height: 460px;">
  <div style="padding: 24px;">
    <p>Content for {{ leftSelectedValue }}</p>
  </div>
</WinNavigationView>`;

const example1Vue = `const leftSelectedValue = ref('item1');
const leftMenuItems = [
  { value: 'item1', label: 'Menu Item1', icon: '\\uE768' },
  { value: 'item2', label: 'Menu Item2', icon: '\\uE74E' },
  { value: 'item3', label: 'Menu Item3', icon: '\\uE72C' },
  { value: 'item4', label: 'Menu Item4', icon: '\\uE896' }
];`;

// Example 2: Top Navigation
const topSelectedValue = ref('top1');
const topMenuItems = [
  { value: 'top1', label: 'Menu Item1', icon: '' },
  { value: 'top2', label: 'Menu Item2', icon: '' },
  { value: 'top3', label: 'Menu Item3', icon: '' },
  { value: 'top4', label: 'Menu Item4', icon: '' }
];

const topContentTitle = computed(() => {
  const item = topMenuItems.find(i => i.value === topSelectedValue.value);
  return item ? item.label : 'Content';
});

const example2Template = `<WinNavigationView
  :selectedValue="topSelectedValue"
  @update:selectedValue="topSelectedValue = $event"
  :menuItems="topMenuItems"
  header="This is Header Text"
  paneDisplayMode="Top"
  style="height: 460px;">
  <div style="padding: 24px;">
    <p>Content for {{ topSelectedValue }}</p>
  </div>
</WinNavigationView>`;

const example2Vue = `const topSelectedValue = ref('top1');
const topMenuItems = [
  { value: 'top1', label: 'Menu Item1' },
  { value: 'top2', label: 'Menu Item2' },
  { value: 'top3', label: 'Menu Item3' },
  { value: 'top4', label: 'Menu Item4' }
];`;

// Example 3: Hierarchical Navigation
const hierarchicalSelectedValue = ref('home');
const hierarchicalMenuItems = [
  { value: 'home', label: 'Home', icon: '' },
  {
    value: 'account',
    label: 'Account',
    icon: '',
    children: [
      { value: 'mail', label: 'Mail', icon: '' },
      { value: 'calendar', label: 'Calendar', icon: '' }
    ]
  },
  {
    value: 'documents',
    label: 'Document options',
    icon: '',
    selectsOnInvoked: false,
    children: [
      { value: 'create', label: 'Create new', icon: '' },
      { value: 'upload', label: 'Upload file', icon: '' }
    ]
  }
];

const hierarchicalContentTitle = computed(() => {
  for (const item of hierarchicalMenuItems) {
    if (item.value === hierarchicalSelectedValue.value) return item.label;
    if (item.children) {
      const child = item.children.find(c => c.value === hierarchicalSelectedValue.value);
      if (child) return child.label;
    }
  }
  return 'Content';
});

const example3Template = `<WinNavigationView
  :selectedValue="hierarchicalSelectedValue"
  @update:selectedValue="hierarchicalSelectedValue = $event"
  :menuItems="hierarchicalMenuItems"
  header="Hierarchical Menu"
  paneDisplayMode="Left"
  style="height: 460px;">
  <div style="padding: 24px;">
    <p>Content for {{ hierarchicalSelectedValue }}</p>
  </div>
</WinNavigationView>`;

const example3Vue = `const hierarchicalSelectedValue = ref('home');
const hierarchicalMenuItems = [
  { value: 'home', label: 'Home', icon: '\\uE80F' },
  {
    value: 'account',
    label: 'Account',
    icon: '\\uE77B',
    children: [
      { value: 'mail', label: 'Mail', icon: '\\uE715' },
      { value: 'calendar', label: 'Calendar', icon: '\\uE787' }
    ]
  },
  {
    value: 'documents',
    label: 'Document options',
    icon: '\\uE8A5',
    selectsOnInvoked: false,
    children: [
      { value: 'create', label: 'Create new', icon: '\\uE8F4' },
      { value: 'upload', label: 'Upload file', icon: '\\uE8E5' }
    ]
  }
];`;

// Example 4: Footer Menu Items
const footerSelectedValue = ref('browse');
const footerPaneMode = ref('Left');
const footerMenuItems = [
  { value: 'browse', label: 'Browse', icon: '' },
  { value: 'track', label: 'Track an Order', icon: '' },
  { value: 'history', label: 'Order History', icon: '' }
];
const footerBottomItems = [
  { value: 'account', label: 'Account', icon: '' },
  { value: 'cart', label: 'Your Cart', icon: '' },
  { value: 'help', label: 'Help', icon: '' }
];

const footerContentTitle = computed(() => {
  const item = [...footerMenuItems, ...footerBottomItems].find(i => i.value === footerSelectedValue.value);
  return item ? item.label : 'Content';
});

const example4Template = `<WinNavigationView
  :selectedValue="footerSelectedValue"
  @update:selectedValue="footerSelectedValue = $event"
  :menuItems="footerMenuItems"
  :footerItems="footerBottomItems"
  header="This is Header Text"
  :paneDisplayMode="footerPaneMode"
  style="height: 460px;">
  <div style="padding: 24px;">
    <p>Content for {{ footerSelectedValue }}</p>
  </div>
</WinNavigationView>`;

const example4Vue = `const footerSelectedValue = ref('browse');
const footerPaneMode = ref('Left');
const footerMenuItems = [
  { value: 'browse', label: 'Browse', icon: '\\uE8F1' },
  { value: 'track', label: 'Track an Order', icon: '\\uE707' },
  { value: 'history', label: 'Order History', icon: '\\uE8EC' }
];
const footerBottomItems = [
  { value: 'account', label: 'Account', icon: '\\uE77B' },
  { value: 'cart', label: 'Your Cart', icon: '\\uE7BF' },
  { value: 'help', label: 'Help', icon: '\\uE897' }
];`;

// Example 5: API Control
const apiSelectedValue = ref('menu1');
const apiHeader = ref('Header');
const apiPaneTitle = ref('Pane Title');
const apiSettingsVisible = ref(true);
const apiBackVisible = ref(true);
const apiPaneMode = ref('Left');
const apiMenuItems = [
  { value: 'menu1', label: 'Menu Item1', icon: '' },
  { value: 'menu2', label: 'Menu Item2', icon: '' },
  { value: 'menu3', label: 'Menu Item3', icon: '' }
];

const apiContentTitle = computed(() => {
  const item = apiMenuItems.find(i => i.value === apiSelectedValue.value);
  return item ? item.label : apiSelectedValue.value === 'settings' ? 'Settings' : 'Content';
});

const example5Template = `<WinNavigationView
  :selectedValue="apiSelectedValue"
  @update:selectedValue="apiSelectedValue = $event"
  :menuItems="apiMenuItems"
  :header="apiHeader"
  :paneTitle="apiPaneTitle"
  :isSettingsVisible="apiSettingsVisible"
  :isBackButtonVisible="apiBackVisible ? 'visible' : 'collapsed'"
  :paneDisplayMode="apiPaneMode"
  style="height: 540px;">
  <div style="padding: 24px;">
    <p>Content for {{ apiSelectedValue }}</p>
  </div>
</WinNavigationView>`;

const example5Vue = `const apiSelectedValue = ref('menu1');
const apiHeader = ref('Header');
const apiPaneTitle = ref('Pane Title');
const apiSettingsVisible = ref(true);
const apiBackVisible = ref(true);
const apiPaneMode = ref('Left');
const apiMenuItems = [
  { value: 'menu1', label: 'Menu Item1', icon: '\\uE768' },
  { value: 'menu2', label: 'Menu Item2', icon: '\\uE74E' },
  { value: 'menu3', label: 'Menu Item3', icon: '\\uE72C' }
];`;
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
  margin: 0 0 4px 0;
}

.nav-example-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
</style>
