<template>
  <h1 class="page-header">PersonPicture</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>Select different looks for a person</template>
    <template #description>Show a profile image, initials generated from a display name, or explicit initials.</template>
    <div class="person-page-layout">
      <WinPersonPicture
        :profilePicture="profileType === 'image' ? profileImage : ''"
        :displayName="profileType === 'name' ? 'Jane Doe' : ''"
        :initials="profileType === 'initials' ? 'SB' : ''"
        :size="100" />
      <div class="person-options">
        <span class="person-options-title">Profile type</span>
        <WinRadioButton v-model="profileType" value="image">Profile Image</WinRadioButton>
        <WinRadioButton v-model="profileType" value="name">Display Name</WinRadioButton>
        <WinRadioButton v-model="profileType" value="initials">Initials</WinRadioButton>
      </div>
    </div>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinPersonPicture from '../components/WinPersonPicture.vue';
import WinRadioButton from '../components/WinRadioButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const profileType = ref('image');
const profileImage = 'https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png';
</script>

<style>
  .person-page-layout {
    display: flex;
    align-items: flex-start;
    gap: 32px;
    flex-wrap: wrap;
  }

  .person-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 180px;
  }

  .person-options-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
    margin-bottom: 4px;
  }
</style>
