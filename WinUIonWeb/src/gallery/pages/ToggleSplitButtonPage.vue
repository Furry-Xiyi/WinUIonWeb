<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">{{ $t('text.togglesplitbutton') }}</h1>
      <p class="page-description">
        {{ $t('text.a-button-that-can-be-toggled-on-off-with-additio') }}
      </p>
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

    <p class="control-example-description">{{ $t('text.a-simple-togglesplitbutton') }}</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme">
      <template #example>
        <WinToggleSplitButton v-model="toggled" :options="['Option A', 'Option B', 'Option C']">
          {{ $t('text.toggle') }}
        </WinToggleSplitButton>
      </template>
      <template #options>
        <div>State: {{ toggled ? 'On' : 'Off' }}</div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinToggleSplitButton from '../../components/WinToggleSplitButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'togglesplitbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const toggled = ref(false);
</script>

<style scoped>
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


