<template>
  <div class="control-page">
    <h1 class="page-header">ContentDialog</h1>
    <p class="page-description">
      Use a ContentDialog to show relevant information or to provide a modal dialog experience that requires action from the user.
    </p>

    <!-- Example 1: Basic ContentDialog -->
    <WinSettingsCard
      header="A basic content dialog with content."
      description="Show a dialog with a default button set.">
      <template #default>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinButton @click="showDialog1 = true">Show dialog</WinButton>
          <div v-if="dialogResult1" class="output-text">Result: {{ dialogResult1 }}</div>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: ContentDialog without default button -->
    <WinSettingsCard
      header="A content dialog without a default button."
      description="Show a dialog without highlighting any button.">
      <template #default>
        <div style="display: flex; align-items: center; gap: 16px;">
          <WinButton @click="showDialog2 = true">Show dialog without default button</WinButton>
          <div v-if="dialogResult2" class="output-text">Result: {{ dialogResult2 }}</div>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Dialog 1 with default button -->
    <WinContentDialog
      :visible="showDialog1"
      title="Save your work?"
      primaryText="Save"
      secondaryText="Don't Save"
      closeText="Cancel"
      defaultButton="primary"
      @primary="handleDialog1Primary"
      @secondary="handleDialog1Secondary"
      @close="handleDialog1Close">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod.</p>
      <WinCheckBox v-model="uploadToCloud1">Upload your content to the cloud.</WinCheckBox>
    </WinContentDialog>

    <!-- Dialog 2 without default button -->
    <WinContentDialog
      :visible="showDialog2"
      title="Save your work?"
      primaryText="Save"
      secondaryText="Don't Save"
      closeText="Cancel"
      @primary="handleDialog2Primary"
      @secondary="handleDialog2Secondary"
      @close="handleDialog2Close">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod.</p>
      <WinCheckBox v-model="uploadToCloud2">Upload your content to the cloud.</WinCheckBox>
    </WinContentDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinButton from '../components/WinButton.vue';
import WinContentDialog from '../components/WinContentDialog.vue';
import WinCheckBox from '../components/WinCheckBox.vue';

const showDialog1 = ref(false);
const showDialog2 = ref(false);
const uploadToCloud1 = ref(false);
const uploadToCloud2 = ref(false);
const dialogResult1 = ref('');
const dialogResult2 = ref('');

const handleDialog1Primary = () => {
  dialogResult1.value = 'Primary button clicked';
  showDialog1.value = false;
};

const handleDialog1Secondary = () => {
  dialogResult1.value = 'Secondary button clicked';
  showDialog1.value = false;
};

const handleDialog1Close = () => {
  dialogResult1.value = 'Close button clicked';
  showDialog1.value = false;
};

const handleDialog2Primary = () => {
  dialogResult2.value = 'Primary button clicked';
  showDialog2.value = false;
};

const handleDialog2Secondary = () => {
  dialogResult2.value = 'Secondary button clicked';
  showDialog2.value = false;
};

const handleDialog2Close = () => {
  dialogResult2.value = 'Close button clicked';
  showDialog2.value = false;
};
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.output-text {
  padding: 8px 12px;
  background: var(--card-background-secondary);
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
}
</style>
