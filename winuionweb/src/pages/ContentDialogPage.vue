<template>
  <h1 class="page-header">ContentDialog</h1>
  <WinSettingsCard>
    <template #header>A basic content dialog with content.</template>
    <template #description>Show a dialog with a default button set.</template>
    <WinButton @click="showDialog1 = true">Show dialog</WinButton>
  </WinSettingsCard>
  <WinSettingsCard>
    <template #header>A content dialog without a default button.</template>
    <template #description>Show a dialog without highlighting any button.</template>
    <WinButton @click="showDialog2 = true">Show dialog without default button</WinButton>
  </WinSettingsCard>

  <WinContentDialog :visible="showDialog1"
                    title="Save your work?"
                    primaryText="Save"
                    secondaryText="Don't Save"
                    closeText="Cancel"
                    defaultButton="primary"
                    @primary="showDialog1 = false"
                    @secondary="showDialog1 = false"
                    @close="showDialog1 = false">
    <p>Lorem ipsum dolor sit amet, adipisicing elit.</p>
    <WinCheckBox v-model="uploadToCloud">Upload your content to the cloud.</WinCheckBox>
  </WinContentDialog>

  <WinContentDialog :visible="showDialog2"
                    title="Save your work?"
                    primaryText="Save"
                    secondaryText="Don't Save"
                    closeText="Cancel"
                    @primary="showDialog2 = false"
                    @secondary="showDialog2 = false"
                    @close="showDialog2 = false">
    <p>Lorem ipsum dolor sit amet, adipisicing elit.</p>
    <WinCheckBox v-model="uploadToCloud2">Upload your content to the cloud.</WinCheckBox>
  </WinContentDialog>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinButton from '../components/WinButton.vue';
import WinContentDialog from '../components/WinContentDialog.vue';
import WinCheckBox from '../components/WinCheckBox.vue';

const showDialog1 = ref(false);
const showDialog2 = ref(false);
const uploadToCloud = ref(false);
const uploadToCloud2 = ref(false);
</script>
