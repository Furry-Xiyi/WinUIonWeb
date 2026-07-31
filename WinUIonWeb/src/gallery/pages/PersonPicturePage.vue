<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.personpicture')" />
          <WinTextBlock class="page-description" :Text="$t('text.displays-a-persons-picture')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.personpicture.select-looks')" :theme="pageTheme" :vue="personPictureCode">
              <template #example>
                <WinPersonPicture
                  :ProfilePicture="profileType === 'image' ? profileImage : ''"
                  :DisplayName="profileType === 'displayName' ? 'Jane Doe' : ''"
                  :Initials="profileType === 'initials' ? 'SB' : ''" />
              </template>
              <template #options>
                <WinRadioButton :Header="$t('sample.personpicture.profile-type')" :ItemsSource="profileTypeItems" v-model:SelectedIndex="profileTypeIndex" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinPersonPicture from '../../components/WinPersonPicture.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'personpicture');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const profileImage = 'https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png';
const profileTypeIndex = ref(0);
const profileTypes = ['image', 'displayName', 'initials'];
const profileType = computed(() => profileTypes[profileTypeIndex.value]);
const profileTypeItems = computed(() => [
  { Text: t('sample.personpicture.profile-image') },
  { Text: t('sample.personpicture.display-name') },
  { Text: t('sample.personpicture.initials') }
]);

const personPictureCode = computed(() => {
  if (profileType.value === 'image') return `<WinPersonPicture ProfilePicture="${profileImage}" />`;
  if (profileType.value === 'displayName') return `<WinPersonPicture DisplayName="Jane Doe" />`;
  return `<WinPersonPicture Initials="SB" />`;
});
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
</style>
