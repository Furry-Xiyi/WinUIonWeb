<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">PasswordBox</h1>
      <p class="page-description">
        A PasswordBox is a text input box that conceals the characters typed into it for the purpose of privacy. A PasswordBox looks like a text box, except that it renders placeholder characters in place of the text that has been entered. You can configure the placeholder character.
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

    <!-- Example 1: A simple PasswordBox -->
    <WinControlExample
      headerText="A simple PasswordBox"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinPasswordBox
          style="width: 300px;"
          v-model="password1"
          @passwordChanged="handlePasswordChanged" />
      </template>
      <template #options>
        <p v-if="passwordError" class="output-text error-text">{{ passwordError }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: A PasswordBox with header, placeholder text and custom character -->
    <WinControlExample
      headerText="A PasswordBox with header, placeholder text and custom character"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <WinPasswordBox
          style="width: 300px;"
          header="Password"
          placeholderText="Enter your password"
          passwordChar="#"
          v-model="password2" />
      </template>
    </WinControlExample>

    <!-- Example 3: A PasswordBox with reveal mode -->
    <WinControlExample
      headerText="A PasswordBox with reveal mode"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="display: flex; align-items: center; gap: 8px;">
          <WinPasswordBox
            style="width: 250px;"
            v-model="password3"
            :passwordRevealMode="revealMode" />
          <WinCheckBox
            v-model="showPassword"
            @checked="onShowPasswordChecked"
            @unchecked="onShowPasswordUnchecked">
            Show password
          </WinCheckBox>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinPasswordBox from '../components/WinPasswordBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'passwordbox');

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

// Example 1: Simple PasswordBox with validation
const password1 = ref('');
const passwordError = ref('');

const handlePasswordChanged = (value) => {
  if (value === '' || value === 'Password') {
    passwordError.value = "'Password' is not allowed.";
    password1.value = '';
  } else {
    passwordError.value = '';
  }
};

const example1Template = `<WinPasswordBox
  style="width: 300px;"
  v-model="password"
  @passwordChanged="handlePasswordChanged" />`;

const example1Vue = `const password = ref('');

const handlePasswordChanged = (value) => {
  if (value === '' || value === 'Password') {
    console.log("'Password' is not allowed.");
    password.value = '';
  }
};`;

// Example 2: PasswordBox with header and placeholder
const password2 = ref('');

const example2Template = `<WinPasswordBox
  style="width: 300px;"
  header="Password"
  placeholderText="Enter your password"
  passwordChar="#"
  v-model="password" />`;

const example2Vue = `const password = ref('');`;

// Example 3: PasswordBox with reveal mode
const password3 = ref('');
const showPassword = ref(false);
const revealMode = computed(() => showPassword.value ? 'Visible' : 'Hidden');

const onShowPasswordChecked = () => {
  showPassword.value = true;
};

const onShowPasswordUnchecked = () => {
  showPassword.value = false;
};

const example3Template = `<div style="display: flex; align-items: center; gap: 8px;">
  <WinPasswordBox
    style="width: 250px;"
    v-model="password"
    :passwordRevealMode="revealMode" />
  <WinCheckBox
    v-model="showPassword"
    @checked="onShowPasswordChecked"
    @unchecked="onShowPasswordUnchecked">
    Show password
  </WinCheckBox>
</div>`;

const example3Vue = `const password = ref('');
const showPassword = ref(false);
const revealMode = computed(() =>
  showPassword.value ? 'Visible' : 'Hidden'
);

const onShowPasswordChecked = () => {
  showPassword.value = true;
};

const onShowPasswordUnchecked = () => {
  showPassword.value = false;
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

.error-text {
  color: var(--system-error-default);
}
</style>
