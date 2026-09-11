<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div style="position: relative;" class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.passwordbox')" />
          <TextBlock class="page-description" :Text="$t('text.a-passwordbox-is-a-text-input-box-that-conceals')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template" :headerText="$t('text.a-simple-passwordbox')">
              <template #example>
                <div class="stack-example">
                  <PasswordBox v-model:Password="simplePassword" :Width="300" @PasswordChanged="onSimplePasswordChanged" />
                  <TextBlock v-if="passwordMessage" class="error-text" :Text="passwordMessage" />
                </div>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template" :headerText="$t('sample.passwordbox.header-placeholder-character')">
              <template #example>
                <PasswordBox :Header="$t('sample.passwordbox.password')" :PlaceholderText="$t('sample.passwordbox.enter-password')" PasswordChar="#" :Width="300" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template" :headerText="$t('sample.passwordbox.reveal-mode')">
              <template #example>
                <div class="horizontal-example">
                  <PasswordBox v-model:Password="revealPassword" :PasswordRevealMode="showPassword ? 'Visible' : 'Hidden'" :Width="250" />
                  <CheckBox v-model="showPassword"><TextBlock :Text="$t('sample.passwordbox.show-password')" /></CheckBox>
                </div>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import PasswordBox from '../../components/PasswordBox.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const example1Template = `<PasswordBox
  v-model:Password="simplePassword"
  :Width="300"
  @PasswordChanged="onSimplePasswordChanged" />`;

const example2Template = computed(() => `<PasswordBox
  Header="${t('sample.passwordbox.password')}"
  PlaceholderText="${t('sample.passwordbox.enter-password')}"
  PasswordChar="#"
  :Width="300" />`);

const example3Template = computed(() => `<div class="horizontal-example">
  <PasswordBox
    v-model:Password="revealPassword"
    :PasswordRevealMode="showPassword ? 'Visible' : 'Hidden'"
    :Width="250" />
  <CheckBox v-model="showPassword">
    <TextBlock Text="${t('sample.passwordbox.show-password')}" />
  </CheckBox>
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
