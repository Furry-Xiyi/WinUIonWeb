<template>
  <div class="control-page">
    <h1 class="page-header">Button</h1>
    <p class="page-description">
      A button gives the user a way to trigger an immediate action.
    </p>

    <!-- Example 1: Simple Button -->
    <WinSettingsCard
      header="A simple Button with text content."
      description="Click the button to trigger an action.">
      <template #default>
        <WinButton
          :disabled="!example1Enabled"
          @click="onButton1Click">
          Standard XAML button
        </WinButton>
      </template>
      <template #options>
        <WinCheckBox v-model="example1Enabled">
          Enable button
        </WinCheckBox>
      </template>
      <template #output>
        <div v-if="control1Output" class="output-text">{{ control1Output }}</div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: Button with Image -->
    <WinSettingsCard
      header="A Button with graphical content."
      description="Button content can include images or other elements.">
      <template #default>
        <WinButton
          @click="onButton2Click"
          style="width: 50px; height: 50px; padding: 4px;">
          <img
            src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png"
            alt="Pie slice"
            style="width: 100%; height: 100%; object-fit: contain;" />
        </WinButton>
      </template>
      <template #output>
        <div v-if="control2Output" class="output-text">{{ control2Output }}</div>
      </template>
    </WinSettingsCard>

    <!-- Example 3: Button Styles -->
    <WinSettingsCard
      header="Button styles"
      description="AccentButtonStyle and SubtleButtonStyle provide visual emphasis.">
      <template #default>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <WinButton primary>Accent style button</WinButton>
          <WinButton subtle>Subtle style button</WinButton>
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 4: Text Wrapping -->
    <WinSettingsCard
      header="Button content wrapping"
      description="Long text content in buttons may be clipped. Here are options to handle text wrapping.">
      <template #default>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 500px;">
          <div class="wrapping-example">
            <p style="margin: 0 0 8px 0; font-size: 13px;">
              The following buttons' content may get clipped if we don't pay careful attention to their layout containers.
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px;">
              One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:
            </p>
            <WinButton style="width: 100%; margin-bottom: 5px;">
              This is some text that is too long and will get cut off
            </WinButton>
            <WinButton style="width: 100%;">
              This is another text that would result in being cut off
            </WinButton>

            <p style="margin: 12px 0 8px 0; font-size: 13px;">
              Another option is to explicitly wrap the Button's content:
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <WinButton :wrap="true" style="max-width: 240px;">
                This is some text that is too long and will get cut off without wrapping
              </WinButton>
              <WinButton :wrap="true" style="max-width: 240px;">
                This is another text that would result in being cut off without wrapping
              </WinButton>
            </div>
          </div>
        </div>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinCheckBox from '../components/WinCheckBox.vue';

const example1Enabled = ref(true);
const control1Output = ref('');
const control2Output = ref('');

const onButton1Click = () => {
  control1Output.value = `Button clicked at ${new Date().toLocaleTimeString()}`;
};

const onButton2Click = () => {
  control2Output.value = `Image button clicked at ${new Date().toLocaleTimeString()}`;
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
}

.output-text {
  padding: 8px 12px;
  background: var(--card-background-secondary);
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
  margin-top: 12px;
}

.wrapping-example p {
  line-height: 1.5;
  color: var(--text-secondary);
}
</style>
