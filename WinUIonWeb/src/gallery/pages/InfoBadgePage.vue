<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">InfoBadge</h1>
      <p class="page-description">
        Badging is a non-intrusive and intuitive way to display notifications or bring focus to an area within an app - whether that be for notifications, indicating new content, or showing an alert. An InfoBadge is a small piece of UI that can be added into an app and customized to display a number, icon, or a simple dot.
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

    <!-- Example 1: InfoBadge embedded in NavigationView -->
    <WinControlExample
      headerText="An InfoBadge embedded in a NavigationView"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="width: 100%; height: 300px;">
          <WinNavigationView
            :menuItems="navigationMenuItems"
            selectedValue="inbox"
            paneDisplayMode="Left"
            :isSettingsVisible="false"
            :isPaneToggleButtonVisible="false">
          </WinNavigationView>
        </div>
      </template>
      <template #options>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 160px;">
          <WinToggleSwitch
            v-model="infoBadgeVisible"
            header="InfoBadge Opacity">
          </WinToggleSwitch>
          <WinComboBox
            v-model="displayModeValue"
            header="Display Mode"
            :options="displayModeOptions">
          </WinComboBox>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: Different InfoBadge styles -->
    <WinControlExample
      headerText="Different InfoBadge styles"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="display: flex; gap: 20px; align-items: center; justify-content: center; height: 100px;">
          <WinInfoBadge
            :styleVariant="badgeStyle"
            iconSource="E7BA">
          </WinInfoBadge>
          <WinInfoBadge
            :styleVariant="badgeStyle"
            :value="10">
          </WinInfoBadge>
          <WinInfoBadge
            :styleVariant="badgeStyle"
            :value="-1">
          </WinInfoBadge>
        </div>

        <div style="width: 160px;">
          <WinComboBox
            v-model="badgeStyle"
            header="Styles"
            :options="styleOptions">
          </WinComboBox>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: InfoBadge placed inside a Button -->
    <WinControlExample
      headerText="An InfoBadge placed inside a Button"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <WinButton
          style="width: 200px; height: 60px; position: relative;"
          aria-label="Refresh required">
          <span class="icon" style="font-size: 20px;">&#xE72C;</span>
          <WinInfoBadge
            iconSource="E7BA"
            background="#C42B1C"
            style="position: absolute; top: 4px; right: 4px;">
          </WinInfoBadge>
        </WinButton>
      </template>
    </WinControlExample>

    <!-- Example 4: InfoBadge with dynamic value -->
    <WinControlExample
      headerText="An InfoBadge with a dynamic integer value"
      :theme="pageTheme"
      :templateCode="example4Template"
      :vueCode="example4Vue">
      <template #example>
        <div style="display: flex; justify-content: center; align-items: center; height: 80px;">
          <WinInfoBadge :value="dynamicValue"></WinInfoBadge>
        </div>

        <div style="width: 160px;">
          <div class="number-input-container">
            <label class="number-input-label">InfoBadge Value</label>
            <input
              type="number"
              v-model.number="dynamicValue"
              :min="-1"
              class="number-input"
            />
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinInfoBadge from '../../components/WinInfoBadge.vue';
import WinNavigationView from '../../components/WinNavigationView.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'infobadge');

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

// Example 1: NavigationView with InfoBadge
const infoBadgeVisible = ref(true);
const displayModeValue = ref('LeftExpanded');
const displayModeOptions = [
  { label: 'LeftExpanded', value: 'LeftExpanded' },
  { label: 'LeftCompact', value: 'LeftCompact' },
  { label: 'Top', value: 'Top' }
];

const navigationMenuItems = computed(() => [
  {
    label: 'Home',
    value: 'home',
    icon: ''
  },
  {
    label: 'Account',
    value: 'account',
    icon: ''
  },
  {
    label: 'Inbox',
    value: 'inbox',
    icon: '',
    badge: {
      value: 5,
      opacity: infoBadgeVisible.value ? 1.0 : 0.0
    }
  }
]);

const example1Template = `<WinNavigationView
  :menuItems="menuItems"
  selectedValue="inbox"
  paneDisplayMode="Left">
  <!-- NavigationViewItem with InfoBadge -->
</WinNavigationView>`;

const example1Vue = `const menuItems = [
  {
    label: 'Home',
    value: 'home',
    icon: '\\uE80F'
  },
  {
    label: 'Inbox',
    value: 'inbox',
    icon: '\\uE715',
    badge: { value: 5 }
  }
];`;

// Example 2: Different InfoBadge styles
const badgeStyle = ref('attention');
const styleOptions = [
  { label: 'Attention', value: 'attention' },
  { label: 'Informational', value: 'informational' },
  { label: 'Success', value: 'success' },
  { label: 'Critical', value: 'critical' }
];

const example2Template = `<div style="display: flex; gap: 20px;">
  <WinInfoBadge
    :styleVariant="badgeStyle"
    iconSource="E7BA">
  </WinInfoBadge>
  <WinInfoBadge
    :styleVariant="badgeStyle"
    :value="10">
  </WinInfoBadge>
  <WinInfoBadge
    :styleVariant="badgeStyle"
    :value="-1">
  </WinInfoBadge>
</div>`;

const example2Vue = `const badgeStyle = ref('attention');

// Icon badge
<WinInfoBadge styleVariant="attention" iconSource="E7BA" />

// Value badge
<WinInfoBadge styleVariant="attention" :value="10" />

// Dot badge
<WinInfoBadge styleVariant="attention" :value="-1" />`;

// Example 3: InfoBadge inside Button
const example3Template = `<WinButton style="position: relative; width: 200px; height: 60px;">
  <span class="icon">&#xE72C;</span>
  <WinInfoBadge
    iconSource="E7BA"
    background="#C42B1C"
    style="position: absolute; top: 4px; right: 4px;">
  </WinInfoBadge>
</WinButton>`;

const example3Vue = `<WinButton style="position: relative;">
  <span class="icon">&#xE72C;</span>
  <WinInfoBadge
    iconSource="E7BA"
    background="#C42B1C"
    style="position: absolute; top: 4px; right: 4px;">
  </WinInfoBadge>
</WinButton>`;

// Example 4: Dynamic value
const dynamicValue = ref(1);

const example4Template = `<WinInfoBadge :value="dynamicValue"></WinInfoBadge>`;

const example4Vue = `const dynamicValue = ref(1);

<WinInfoBadge :value="dynamicValue"></WinInfoBadge>`;
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

.number-input-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.number-input-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.number-input {
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--ctrl-border-rest);
  border-radius: 4px;
  background: var(--ctrl-fill-default);
  color: var(--text-primary);
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  font-size: 14px;
  transition: all var(--fast-duration) var(--fast-out-slow-in);
}

.number-input:hover {
  border-color: var(--ctrl-border-hover);
  background: var(--ctrl-fill-secondary);
}

.number-input:focus {
  outline: none;
  border-color: var(--accent-base);
  background: var(--ctrl-fill-input-active);
}
</style>
