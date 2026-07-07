<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" :Text="$t('text.passwordbox')" />
      <WinTextBlock class="page-description" :Text="$t('text.a-passwordbox-is-a-text-input-box-that-conceals')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton @click="toggleTheme" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon"></span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-passwordbox')" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template">
      <template #example>
        <div class="stack-example">
          <WinPasswordBox v-model:Password="simplePassword" :Width="300" @PasswordChanged="onSimplePasswordChanged" />
          <WinTextBlock v-if="passwordMessage" class="error-text" :Text="passwordMessage" />
        </div>
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A PasswordBox with header, placeholder text and custom character" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template">
      <template #example>
        <WinPasswordBox Header="Password" PlaceholderText="Enter your password" PasswordChar="#" :Width="300" />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" Text="A PasswordBox with reveal mode" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template">
      <template #example>
        <div class="horizontal-example">
          <WinPasswordBox v-model:Password="revealPassword" :PasswordRevealMode="showPassword ? 'Visible' : 'Hidden'" :Width="250" />
          <WinCheckBox v-model="showPassword"><WinTextBlock Text="Show password" /></WinCheckBox>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinPasswordBox from '../../components/WinPasswordBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'passwordbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const simplePassword = ref('');
const revealPassword = ref('');
const showPassword = ref(false);
const passwordMessage = ref('');

const onSimplePasswordChanged = ({ password }) => {
  passwordMessage.value = password === 'Password' ? "'Password' is not allowed." : '';
};

const example1Template = `<WinPasswordBox
  v-model:Password="simplePassword"
  :Width="300"
  @PasswordChanged="onSimplePasswordChanged" />`;

const example2Template = `<WinPasswordBox
  Header="Password"
  PlaceholderText="Enter your password"
  PasswordChar="#"
  :Width="300" />`;

const example3Template = `<div class="horizontal-example">
  <WinPasswordBox
    v-model:Password="revealPassword"
    :PasswordRevealMode="showPassword ? 'Visible' : 'Hidden'"
    :Width="250" />
  <WinCheckBox v-model="showPassword">
    <WinTextBlock Text="Show password" />
  </WinCheckBox>
</div>`;
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets'; }
.stack-example { display: flex; flex-direction: column; gap: 8px; }
.horizontal-example { display: flex; align-items: center; gap: 8px; }
.error-text { color: var(--system-error-default, #c42b1c); font-size: 14px; }
</style>
