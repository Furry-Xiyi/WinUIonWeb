<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.hyperlinkbutton') }}</h1>
      <p class="page-description">{{ $t('text.a-button-that-appears-as-a-hyperlink') }}</p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon"></span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <p class="control-example-description">{{ $t('text.a-hyperlinkbutton-with-navigateuri') }}</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinHyperlinkButton
          navigateUri="https://www.microsoft.com"
          :openInNewWindow="true"
          :disabled="disableControl1">
          {{ $t('text.microsoft-home-page') }}
        </WinHyperlinkButton>
      </template>
      <template #options>
        <WinCheckBox v-model="disableControl1">
          Disable hyperlink button
        </WinCheckBox>
      </template>
    </WinControlExample>

    <p class="control-example-description">A HyperlinkButton handling the Click event.</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinHyperlinkButton @click="goToToggleButton">
          Go to ToggleButton
        </WinHyperlinkButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'hyperlinkbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const disableControl1 = ref(false);

const goToToggleButton = () => {
  currentPage.value = 'togglebutton';
};
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




