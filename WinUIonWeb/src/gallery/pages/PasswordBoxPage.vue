<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.passwordbox')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-passwordbox-is-a-text-input-box-that-conceals')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('text.a-simple-passwordbox')">
              <template #example>
                <div class="stack-example">
                  <WinPasswordBox v-model:Password="simplePassword" :Width="300" @PasswordChanged="onSimplePasswordChanged" />
                  <WinTextBlock v-if="passwordMessage" class="error-text" :Text="passwordMessage" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.passwordbox.header-placeholder-character')">
              <template #example>
                <WinPasswordBox :Header="$t('sample.passwordbox.password')" :PlaceholderText="$t('sample.passwordbox.enter-password')" PasswordChar="#" :Width="300" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template" :headerText="$t('sample.passwordbox.reveal-mode')">
              <template #example>
                <div class="horizontal-example">
                  <WinPasswordBox v-model:Password="revealPassword" :PasswordRevealMode="showPassword ? 'Visible' : 'Hidden'" :Width="250" />
                  <WinCheckBox v-model="showPassword"><WinTextBlock :Text="$t('sample.passwordbox.show-password')" /></WinCheckBox>
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
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinPasswordBox from '../../components/WinPasswordBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'passwordbox');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const simplePassword = ref('');
const revealPassword = ref('');
const showPassword = ref(false);
const passwordMessage = ref('');

const onSimplePasswordChanged = ({ password }) => {
  passwordMessage.value = password === 'Password' ? t('sample.passwordbox.not-allowed') : '';
};

const example1Template = `<WinPasswordBox
  v-model:Password="simplePassword"
  :Width="300"
  @PasswordChanged="onSimplePasswordChanged" />`;

const example2Template = computed(() => `<WinPasswordBox
  Header="${t('sample.passwordbox.password')}"
  PlaceholderText="${t('sample.passwordbox.enter-password')}"
  PasswordChar="#"
  :Width="300" />`);

const example3Template = computed(() => `<div class="horizontal-example">
  <WinPasswordBox
    v-model:Password="revealPassword"
    :PasswordRevealMode="showPassword ? 'Visible' : 'Hidden'"
    :Width="250" />
  <WinCheckBox v-model="showPassword">
    <WinTextBlock Text="${t('sample.passwordbox.show-password')}" />
  </WinCheckBox>
</div>`);
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; }
.stack-example { display: flex; flex-direction: column; gap: 8px; }
.horizontal-example { display: flex; align-items: center; gap: 8px; }
.error-text { color: var(--system-error-default, #c42b1c); font-size: 14px; }
</style>
