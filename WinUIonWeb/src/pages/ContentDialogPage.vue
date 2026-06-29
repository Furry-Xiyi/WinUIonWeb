<template>
  <div>
    <h1 class="page-header">ContentDialog</h1>
    <p class="page-description">
      Use a ContentDialog to show relevant information or to provide a modal dialog experience that requires action from the user.
    </p>

    <!-- Example 1: Basic ContentDialog -->
    <WinControlExample headerText="A basic content dialog with content.">
      <template #example>
        <WinButton @click="showDialog1 = true">Show dialog</WinButton>
      </template>
      <template #output>
        <div v-if="dialogResult1" class="output-text">Result: {{ dialogResult1 }}</div>
        <div v-else class="output-text">Click the button to show the dialog.</div>
      </template>
    </WinControlExample>

    <!-- Example 2: ContentDialog without default button -->
    <WinControlExample headerText="A content dialog without a default button.">
      <template #example>
        <WinButton @click="showDialog2 = true">Show dialog without default button</WinButton>
      </template>
      <template #output>
        <div v-if="dialogResult2" class="output-text">Result: {{ dialogResult2 }}</div>
        <div v-else class="output-text">Click the button to show the dialog.</div>
      </template>
    </WinControlExample>

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
import WinControlExample from '../components/WinControlExample.vue';
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
