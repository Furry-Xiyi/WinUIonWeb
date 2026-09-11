<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.personpicture')" />
        <TextBlock class="page-description" :Text="$t('text.personpicture-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.personpicture.select-looks')" :theme="pageTheme" :vue="personPictureCode">
          <template #example>
            <PersonPicture
              Height="300"
              VerticalAlignment="Top"
              :ProfilePicture="profileType === 'image' ? profileImage : ''"
              :DisplayName="profileType === 'displayName' ? 'Jane Doe' : ''"
              :Initials="profileType === 'initials' ? 'SB' : ''" />
          </template>
          <template #options>
            <RadioButton :Header="$t('sample.personpicture.profile-type')" :ItemsSource="profileTypeItems" :SelectedIndex="profileTypeIndex" @update:SelectedIndex="profileTypeIndex = $event" />
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import PersonPicture from '../../components/PersonPicture.vue';
import RadioButton from '../../components/RadioButton.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'personpicture');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const profileImageUri = 'https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png';
const profileImage = profileImageUri;
const profileTypeIndex = ref(0);
const profileTypes = ['image', 'displayName', 'initials'];
const profileType = computed(() => profileTypes[profileTypeIndex.value]);
const profileTypeItems = computed(() => [
  { Text: t('sample.personpicture.profile-image') },
  { Text: t('sample.personpicture.display-name') },
  { Text: t('sample.personpicture.initials') }
]);

const personPictureCode = computed(() => {
  if (profileType.value === 'image') return `<PersonPicture Height="300" VerticalAlignment="Top" ProfilePicture="${profileImageUri}" />`;
  if (profileType.value === 'displayName') return '<PersonPicture Height="300" VerticalAlignment="Top" DisplayName="Jane Doe" />';
  return '<PersonPicture Height="300" VerticalAlignment="Top" Initials="SB" />';
});
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
