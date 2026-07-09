<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" :Text="$t('text.toggleswitch')" />
      <WinTextBlock class="page-description" :Text="$t('text.use-toggleswitch-controls-to-present-users-with')" TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-toggleswitch')" />

    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="toggleSwitchSimpleVue">
      <template #example>
        <WinToggleSwitch />
      </template>
    </WinControlExample>

    <WinTextBlock class="control-example-description" :Text="$t('sample.toggleswitch.custom')" />

    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="toggleSwitchCustomVue">
      <template #example>
        <div class="horizontal-stack">
          <WinToggleSwitch
            :Header="$t('sample.toggle-work')"
            :IsOn="workToggle"
            :OffContent="$t('sample.do-work')"
            :OnContent="$t('sample.working')"
            @update:IsOn="workToggle = $event" />
          <WinProgressRing Width="32" :IsActive="workToggle" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinProgressRing from '../../components/WinProgressRing.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'toggleswitch');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const workToggle = ref(true);

const toggleSwitchSimpleVue = `<WinToggleSwitch AutomationProperties.Name="simple ToggleSwitch" />`;
const toggleSwitchCustomVue = `<div>
  <WinToggleSwitch Header="Toggle work" OffContent="Do work" OnContent="Working" :IsOn="true" />
  <WinProgressRing :IsActive="true" Width="32" />
</div>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", "WinUIOnWebIcons"; font-size: 16px; }
.horizontal-stack { display: flex; align-items: center; gap: 0; }
</style>
