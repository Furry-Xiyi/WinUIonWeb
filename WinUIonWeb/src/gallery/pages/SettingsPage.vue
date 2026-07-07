<template>
  <WinTextBlock class="page-header" :Text="$t('text.settings')" />
  <WinTextBlock class="settings-section-title" :Text="$t('text.appearance')" />
  <WinExpander>
    <template #header>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="icon" style="font-size: 20px; width: 25px; text-align: center;"></span>
        <div style="display: flex; flex-direction: column;">
          <WinTextBlock class="settings-card-title" :Text="$t('text.theme')" />
          <WinTextBlock class="settings-card-description" :Text="$t('text.choose-your-app-color-mode')" />
        </div>
      </div>
    </template>
    <WinRadioButton value="system" v-model="themeSetting"><WinTextBlock :Text="$t('text.use-system-setting')" /></WinRadioButton>
    <WinRadioButton value="light" v-model="themeSetting"><WinTextBlock :Text="$t('text.light')" /></WinRadioButton>
    <WinRadioButton value="dark" v-model="themeSetting"><WinTextBlock :Text="$t('text.dark')" /></WinRadioButton>
  </WinExpander>
  <WinExpander v-if="isHostedInUwpWebView">
    <template #header>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="icon" style="font-size: 20px; width: 25px; text-align: center;">&#xE2B1;</span>
        <div style="display: flex; flex-direction: column;">
          <WinTextBlock class="settings-card-title" :Text="$t('text.material')" />
          <WinTextBlock class="settings-card-description" :Text="$t('text.choose-the-app-background-material')" />
        </div>
      </div>
    </template>
    <WinRadioButton value="mica" v-model="materialSetting"><WinTextBlock :Text="$t('text.mica')" /></WinRadioButton>
    <WinRadioButton value="acrylic" v-model="materialSetting"><WinTextBlock :Text="$t('text.acrylic')" /></WinRadioButton>
  </WinExpander>
  <WinExpander>
    <template #header>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="icon" style="font-size: 20px; width: 25px; text-align: center;">&#xE8AB;</span>
        <div style="display: flex; flex-direction: column;">
          <WinTextBlock class="settings-card-title" :Text="$t('text.page-transition')" />
          <WinTextBlock class="settings-card-description" :Text="$t('text.animation-style-when-switching-pages')" />
        </div>
      </div>
    </template>
    <WinRadioButton value="entrance" v-model="animSetting"><WinTextBlock :Text="$t('text.entrance-slide-up')" /></WinRadioButton>
    <WinRadioButton value="drill" v-model="animSetting"><WinTextBlock :Text="$t('text.drill-left-right')" /></WinRadioButton>
    <WinRadioButton value="fade" v-model="animSetting"><WinTextBlock :Text="$t('text.fade')" /></WinRadioButton>
  </WinExpander>
  <WinSettingsCard>
    <template #header>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="icon" style="font-size: 20px; width: 25px; text-align: center;">&#xF594;</span>
        <div style="display: flex; flex-direction: column;">
          <WinTextBlock class="settings-card-title" :Text="$t('text.navigation-pane-position')" />
          <WinTextBlock class="settings-card-description" :Text="$t('text.select-the-navigation-bar-position')" />
        </div>
      </div>
    </template>
    <WinComboBox :options="navPositionOptions" :modelValue="navPositionIndex" @update:modelValue="v => navPosition = navPositionValues[v]" />
  </WinSettingsCard>
</template>

<script setup>
import { computed, inject } from 'vue';
import WinExpander from '../../components/WinExpander.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinSettingsCard from '../../components/WinSettingsCard.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import { useI18n } from '../../components/i18n';

const { t } = useI18n();
const themeSetting = inject('themeSetting');
const materialSetting = inject('materialSetting');
const animSetting = inject('animSetting');
const navPosition = inject('navPosition');
const isHostedInUwpWebView = inject('isHostedInUwpWebView');
const navPositionOptions = [
  { label: t('text.left'), value: 'Auto' },
  { label: t('text.top'), value: 'Top' }
];
const navPositionValues = navPositionOptions.map(option => option.value);
const navPositionIndex = computed(() => Math.max(0, navPositionValues.indexOf(navPosition.value)));
</script>

<style scoped>
.settings-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.settings-card-title {
  font-size: 14px;
}

.settings-card-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
</style>
